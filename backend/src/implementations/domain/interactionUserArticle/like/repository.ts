import { Transaction, Record, Integer } from "neo4j-driver";
import { Inject, Injectable } from "@nestjs/common";
import { NEO4J_TRANSACTION_TOKEN } from "../../../../tokens";
import { ArticleId } from "../../../../domain/article/props/articleId";
import { UserId } from "../../../../domain/user/props/userId";
import { Timestamp, Like } from "../../../../domain/interactionUserArticle/like/entity";
import {  ArticleNotFoundError, LikeRepository, UserNotFoundError } from "../../../../domain/interactionUserArticle/like/repository";

type FindResult = {
  articleId: ArticleId;
  userId: UserId;
  timestamp: Integer;
};
@Injectable()
export class LikeRepositoryImpl implements LikeRepository {
  constructor(
    @Inject(NEO4J_TRANSACTION_TOKEN) private readonly tx: Transaction
  ) {}

  mapFromDb(record: Record<FindResult>): Like {
    const r = record.toObject();
    return new Like(
      r.articleId,
      r.userId,
      new Timestamp(new Date(r.timestamp.toNumber()))
    );
  }

  mapToDb(like: Like): FindResult {
    return {
      articleId: like.articleId,
      userId: like.userId,
      timestamp: Integer.fromNumber(like.timestamp.getTime()),
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

  async findByUserId(uId: UserId): Promise<Like[]> {
    await this.assertUserExists(uId);
    const result = await this.tx.run<FindResult>(
      `MATCH (u:User {id: $uId})- [r:LIKES]->(a:Article)
       RETURN a.id AS articleId, u.id AS userId, r.timestamp AS timestamp`,
      { uId }
    );

    return result.records.map(r=>this.mapFromDb(r));
  }

  async create(like: Like): Promise<Like> {
    await this.assertUserExists(like.userId);
    await this.assertArticleExists(like.articleId);
    const result = await this.tx.run<FindResult>(
      `MATCH (u:User {id: $userId})
      MATCH (a:Article {id: $articleId})
      MERGE (u)-[r:LIKES]->(a)
      SET r.timestamp = $timestamp
      RETURN a.id AS articleId, u.id AS userId, r.timestamp AS timestamp`,
      this.mapToDb(like)
    );
    return this.mapFromDb(result.records[0]);
  }

  async delete(articleId: ArticleId, userId: UserId): Promise<true> {
    await this.assertUserExists(userId);
    await this.assertArticleExists(articleId);
    const result = await this.tx.run<{ deleted: Integer }>(
      `MATCH (u:User {id: $userId})- [r:LIKES]->(a:Article {id: $articleId})
       DELETE r`,
      { articleId, userId }
    );
    return true;
  }
}

