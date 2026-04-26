import { Integer, Transaction, Record } from "neo4j-driver";
import { Inject, Injectable } from "@nestjs/common";
import { NEO4J_TRANSACTION_TOKEN } from "../../../../tokens";
import { ArticleId } from "../../../../domain/article/props/articleId";
import { UserId } from "../../../../domain/user/props/userId";
import { Timestamp, View } from "../../../../domain/interactionUserArticle/view/entity";
import { ArticleNotFoundError, UserNotFoundError, ViewRepository } from "../../../../domain/interactionUserArticle/view/repository";

type FindResult = {
  articleId: ArticleId;
  userId: UserId;
  timestamp: Integer;
};

@Injectable()
export class ViewRepositoryImpl implements ViewRepository {
  constructor(
    @Inject(NEO4J_TRANSACTION_TOKEN)
    private readonly tx: Transaction
  ) {}

  private mapFromDb(record: Record<FindResult>): View {
    const r = record.toObject();

    return new View(
      r.articleId,
      r.userId,
      new Timestamp(new Date(r.timestamp.toNumber()))
    );
  }

  private mapToDb(view: View): FindResult {
    return {
      articleId: view.articleId,
      userId: view.userId,
      timestamp: Integer.fromNumber(view.timestamp.getTime()),
    };
  }

  private async assertUserExists(userId: UserId) {
    const res = await this.tx.run(
      `MATCH (u:User {id: $userId}) RETURN u LIMIT 1`,
      { userId }
    );

    if (!res.records.length) {
      throw new UserNotFoundError();
    }
  }

  private async assertArticleExists(articleId: ArticleId) {
    const res = await this.tx.run(
      `MATCH (a:Article {id: $articleId}) RETURN a LIMIT 1`,
      { articleId }
    );

    if (!res.records.length) {
      throw new ArticleNotFoundError();
    }
  }

  async findByUserId(uId: UserId): Promise<View[]> {
    const result = await this.tx.run<FindResult>(
      `
      MATCH (u:User {id: $uId})-[r:VIEWS]->(a:Article)
      RETURN a.id AS articleId, u.id AS userId, r.timestamp AS timestamp
      `,
      { uId }
    );

    return result.records.map((r) => this.mapFromDb(r));
  }

  async create(view: View): Promise<View> {
    await this.assertUserExists(view.userId);
    await this.assertArticleExists(view.articleId);

    const result = await this.tx.run<FindResult>(
      `
      MATCH (u:User {id: $userId}), (a:Article {id: $articleId})
      MERGE (u)-[r:VIEWS]->(a)
      SET r.timestamp = $timestamp
      RETURN a.id AS articleId, u.id AS userId, r.timestamp AS timestamp
      `,
      this.mapToDb(view)
    );

    return this.mapFromDb(result.records[0]);
  }

  async delete(articleId: ArticleId, userId: UserId): Promise<true> {
    await this.assertUserExists(userId);
    await this.assertArticleExists(articleId);

    await this.tx.run(
      `
      MATCH (u:User {id: $userId})-[r:VIEWS]->(a:Article {id: $articleId})
      DELETE r
      `,
      { articleId, userId }
    );

    return true;
  }
}