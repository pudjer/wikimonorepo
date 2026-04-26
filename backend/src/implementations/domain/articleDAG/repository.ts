import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from 'neo4j-driver';
import { ArticleDAG, ArticleIdsUnique } from '../../../domain/articleDAG/entity';
import { ArticleDAGRepository, ArticleNotFoundError } from '../../../domain/articleDAG/repository';
import { ArticleId } from '../../../domain/article/props/articleId';
import { Link, UniqueLinkCollection } from '../../../domain/common/entity';
import { NEO4J_TRANSACTION_TOKEN } from '../../../tokens';
import { ArticleToArticleLinkName } from '../../../domain/article/references';

type Neo4jLink = {
  child: ArticleId;
  parent: ArticleId;
  name: ArticleToArticleLinkName;
};

@Injectable()
export class ArticleDAGRepositoryImpl implements ArticleDAGRepository {
  constructor(@Inject(NEO4J_TRANSACTION_TOKEN) private readonly tx: Transaction) {}

  private async assertArticlesExists(articleIds: ArticleId[]) {
    const result = await this.tx.run(
      `
      MATCH (a:Article)
      WHERE a.id IN $ids
      RETURN count(a) as count
      `,
      { ids: articleIds }
    );
  
    const count = result.records[0].get('count').toNumber();
  
    if (count !== articleIds.length) {
      throw new ArticleNotFoundError();
    }
  }
  async getDAG(articleIds: ArticleIdsUnique): Promise<ArticleDAG> {
    const idsParam = Array.from(articleIds);
    await this.assertArticlesExists(idsParam);
  
    const result = await this.tx.run<{
      nodes: ArticleId[];
      links: Neo4jLink[];
    }>(
      `
      MATCH (seed:Article)
      WHERE seed.id IN $ids

      MATCH path = (seed)-[:EXTENDS*0..]->(n)

      WITH 
        apoc.coll.flatten(collect(nodes(path))) AS allNodes,
        apoc.coll.flatten(collect(relationships(path))) AS rels

      RETURN
        apoc.coll.toSet([node IN allNodes | node.id]) AS nodes,
        apoc.coll.toSet([r IN rels | {
          child: startNode(r).id,
          parent: endNode(r).id,
          name: r.name
        }]) AS links
      `,
      { ids: idsParam }
    );
  
    if (result.records.length === 0) {
      return new ArticleDAG(
        new UniqueLinkCollection([]),
        new Set()
      );
    }
  
    const record = result.records[0];
  
    const nodes = new Set(record.get('nodes'));
  
    const domainLinks = (record.get('links')).map(
      ({ child, parent, name }) => new Link(child, name, parent)
    );
  
    return new ArticleDAG(
      new UniqueLinkCollection(domainLinks),
      nodes as ArticleIdsUnique
    );
  }
}
