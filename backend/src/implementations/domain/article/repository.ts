import { Integer, Transaction } from "neo4j-driver";
import { ArticleFactory, ArticleType, CreatedAt, UpdatedAt } from "../../../domain/article/entity";
import { ArticleReferences } from "../../../domain/article/references";
import { ArticleToArticleLinkName, ArticleReference } from "../../../domain/article/references";
import { ArticleId } from "../../../domain/article/props/articleId";
import { Content } from "../../../domain/article/props/content";
import { Title } from "../../../domain/article/props/title";
import { ArticleRepository, ArticleNotFoundError, AuthorNotFoundError, ArticleLinksCycleError, ArticleInLinkNotFoundError } from "../../../domain/article/repository";
import { UserId } from "../../../domain/user/props/userId";
import { ARTICLE_FACTORY_TOKEN, NEO4J_TRANSACTION_TOKEN } from "../../../tokens";
import { Inject } from "@nestjs/common";



// ==========================
// DB TYPES
// ==========================
type Neo4jArticleNode = {
  id: ArticleId;
  title: Title;
  content: Content;
  createdAt: Integer;
  updatedAt: Integer;
};

type Neo4jLinkRow = {
  name: ArticleToArticleLinkName;
  parent: ArticleId;
};



// ==========================
// REPOSITORY
// ==========================
export class ArticleRepositoryImpl implements ArticleRepository{
  private authorRepository: AuthorRepository;
  private linkRepository: LinkRepository;

  constructor(
    @Inject(NEO4J_TRANSACTION_TOKEN) private readonly tx: Transaction,
    @Inject(ARTICLE_FACTORY_TOKEN) private readonly articleFactory: ArticleFactory
  ) {
    this.authorRepository = new AuthorRepository(this.tx);
    this.linkRepository = new LinkRepository(this.tx);
  }

  async findById(id: ArticleId): Promise<ArticleType> {
    const tx = this.tx
    const result = await tx.run<Neo4jArticleNode>(
      `
      MATCH (a:Article {id: $id})
      RETURN a.id AS id, a.title AS title, a.content AS content, a.createdAt AS createdAt, a.updatedAt AS updatedAt
      `,
      { id }
    );

    if (result.records.length === 0) {
      throw new ArticleNotFoundError();
    }

    const node = result.records[0].toObject();
    const links = await this.linkRepository.getLinks(id)
    const authorId = await this.authorRepository.getAuthorId(id);

    const article = this.toDomain(node, links, authorId);
    return article;
  }

  async findByAuthorId(authorId: UserId): Promise<ArticleId[]> {
    const tx = this.tx;
    await this.authorRepository.assertUserExists(authorId);
    const result = await tx.run<{id: ArticleId}>(
      `
      MATCH (a:Article)-[:AUTHORED_BY]->(u:User {id: $authorId})
      RETURN a.id AS id
      `,
      { authorId }
    );

    const articles = result.records.map((r) => r.get("id"));
    return articles;
  }

// ==========================
// CREATE
// ==========================
  async create(article: ArticleType): Promise<ArticleType> {
    const tx = this.tx
    const { a, links, authorId } = this.toPersistence(article);

    // create article node
    await tx.run(
      `
      CREATE (a:Article {
        id: $a.id,
        title: $a.title,
        content: $a.content,
        createdAt: $a.createdAt,
        updatedAt: $a.updatedAt
      })
      `,
      { a }
    );

    await this.authorRepository.bindAuthor(a.id, authorId);
    await this.linkRepository.addLinks(a.id, links);

    return article;
  }

// ==========================
// UPDATE
// ==========================
  async update(article: ArticleType): Promise<ArticleType> {
    const tx = this.tx
    const { a, links } = this.toPersistence(article);

    const exists = await tx.run<{count: Integer}>(
      `
      MATCH (a:Article {id: $id})
      RETURN count(a) AS count
      `,
      { id: a.id }
    );

    if (exists.records[0].get("count").toNumber() === 0) {
      throw new ArticleNotFoundError();
    }

    // update node
    await tx.run(
      `
      MATCH (a:Article {id: $a.id})
      SET 
        a.title = $a.title,
        a.content = $a.content,
        a.updatedAt = $a.updatedAt
      `,
      { a }
    );

    // replace links (diff-based inside repo)
    await this.linkRepository.replaceLinks(a.id, links);
    return article;
  }

  async delete(articleId: ArticleId): Promise<true> {
    const tx = this.tx
    // delete node
    await tx.run(
      `
      MATCH (a:Article {id: $articleId})
      DETACH DELETE a
      `,
      { articleId }
    );

    return true;
  }
  // ==========================
  // MAPPERS
  // ==========================
  private toDomain(node: Neo4jArticleNode, links: Neo4jLinkRow[], authorId: UserId): ArticleType {

    const linksMapped = new ArticleReferences(
      links
        .filter((l) => l.parent)
        .map(
          (l) =>
            new ArticleReference(
              l.name,
              l.parent
            )
        )
    );

    return this.articleFactory.createExisting(
      node.id,
      authorId,
      node.title,
      node.content,
      linksMapped,
      new CreatedAt(new Date(node.createdAt.toNumber())),
      new UpdatedAt(new Date(node.updatedAt.toNumber()))
    );
  }

  private toPersistence(article: ArticleType): {a: Neo4jArticleNode, links: Neo4jLinkRow[], authorId: UserId} {
    return {
      a: {
        id: article.id,
        title: article.title,
        content: article.content,
        createdAt: Integer.fromNumber(article.createdAt.getTime()),
        updatedAt: Integer.fromNumber(article.updatedAt.getTime()),
      },
      links: Array.from(article.links.values).map((l) => ({
        parent: l.parent,
        name: l.name,
      })),
      authorId: article.authorId,
    };
  }
}


export class AuthorRepository {
  constructor(@Inject(NEO4J_TRANSACTION_TOKEN) private readonly tx: Transaction) {}

  async assertUserExists(userId: UserId): Promise<true> {
    const tx = this.tx
    const result = await tx.run<{ count: Integer }>(
      `
      MATCH (u:User {id: $userId})
      RETURN count(u) AS count
      `,
      { userId }
    );

    const record = result.records[0].get("count").toNumber();
    const foundCount = record;

    if (foundCount === 0) {
      throw new AuthorNotFoundError();
    }
    return true
  }
  async getAuthorId(articleId: ArticleId): Promise<UserId> {
    const tx = this.tx
    const result = await tx.run<{ authorId: UserId }>(
      `
      MATCH (a:Article {id: $articleId})-[:AUTHORED_BY]->(u:User)
      RETURN u.id AS authorId
      `,
      { articleId }
    );
    if (result.records.length === 0) {
      throw new ArticleNotFoundError();
    }
    const record = result.records[0].get("authorId");
    return record
  }
  async bindAuthor(articleId: string, userId: UserId): Promise<true> {
    const tx = this.tx
    await this.assertUserExists(userId);
    await tx.run(
      `
      MATCH (a:Article {id: $articleId})
      MATCH (u:User {id: $userId})
      MERGE (a)-[:AUTHORED_BY]->(u)
      `,
      { articleId, userId }
    );
    return true
  }
}




export class LinkRepository {
  constructor(@Inject(NEO4J_TRANSACTION_TOKEN) private readonly tx: Transaction) {}

  async assertArticlesInLinksExist(
    articleId: ArticleId,
    links: Neo4jLinkRow[]
  ): Promise<true> {
    if (!links.length) return true;
  
    const result = await this.tx.run<{ missing: Integer }>(
      `
      UNWIND $links AS link
  
      OPTIONAL MATCH (a:Article {id: $articleId})
      OPTIONAL MATCH (p:Article {id: link.parent})
  
      WITH link, a, p
      WHERE a IS NULL OR p IS NULL
  
      RETURN count(link) AS missing
      `,
      { links, articleId }
    );
  
    const missing = result.records[0]?.get("missing")?.toNumber() ?? 0;
  
    if (missing > 0) {
      throw new ArticleInLinkNotFoundError();
    }
  
    return true;
  }
  
  async assertArticlesExistsAndNoCycle(articleId: ArticleId, links: Neo4jLinkRow[]): Promise<true> {
    const tx = this.tx
    await this.assertArticlesInLinksExist(articleId, links);
    const result = await tx.run<{ cp: ArticleId }>(
      `
      UNWIND $links AS link
      WITH DISTINCT link.parent AS parent

      WHERE EXISTS { MATCH (:Article {id: parent})-[:EXTENDS*]->(:Article {id: $articleId}) }
      RETURN parent AS cp
      `,
      { links, articleId }
    );
  
    if (result.records.length > 0) {
      const records = result.records.map(r => r.get("cp"));
      throw new ArticleLinksCycleError(records);
    }
  
    return true
  }

  async getLinks(articleId: ArticleId): Promise<Neo4jLinkRow[]> {
    const tx = this.tx
    const result = await tx.run(
      `
      MATCH (a:Article {id: $articleId})-[r:EXTENDS]->(p:Article)
      RETURN r.name AS name, p.id AS parent
      `,
      { articleId }
    );
  
    return result.records.map((record) => ({
      name: record.get('name'),
      parent: record.get('parent'),
    }));
  }

  async addLinks(articleId: ArticleId, links: Neo4jLinkRow[]): Promise<true> {
    const tx = this.tx
    await this.assertArticlesExistsAndNoCycle(articleId, links);
    await tx.run(
      `
      UNWIND $links AS link
      MATCH (a:Article {id: $articleId})
      MATCH (p:Article {id: link.parent})
      MERGE (a)-[r:EXTENDS {name: link.name}]->(p)
      `,
      { links, articleId }
    );
    return true
  }
  async removeLinks(articleId: ArticleId, links: Neo4jLinkRow[]): Promise<true> {
    const tx = this.tx
    await tx.run(
      `
      UNWIND $links AS link
      MATCH (a:Article {id: $articleId})-[r:EXTENDS {name: link.name}]->(p:Article {id: link.parent})
      DELETE r
      `,
      { links, articleId }
    );
    return true
  }


  async replaceLinks(articleId: ArticleId, links: Neo4jLinkRow[]) {

    const old = await this.getLinks(articleId);

    //diff
    const removed = old.filter(l => !links.find(l2 => l2.parent === l.parent && l2.name === l.name));
    const added = links.filter(l => !old.find(l2 => l2.parent === l.parent && l2.name === l.name));
    
    await this.removeLinks(articleId, removed);
    await this.addLinks(articleId, added);

  }


}