import { Integer, Transaction, Record as Neo4jRecord } from "neo4j-driver";
import { Inject, Injectable } from "@nestjs/common";
import { NEO4J_TRANSACTION_TOKEN } from "../../../../tokens";

import { ArticleId } from "../../../../domain/article/props/articleId";
import { UserId } from "../../../../domain/user/props/userId";

import {
  LastInteraction,
  IsViewed,
  IsLiked,
  TotalInteraction,
} from "../../../../domain/interactionUserArticle/total/entity";
import { Record } from "neo4j-driver";
import { LearnProgressStage } from "../../../../domain/interactionUserArticle/learnProgress/entity";
import { ArticleNotFoundError, TotalInteractionRepository, UserNotFoundError } from "../../../../domain/interactionUserArticle/total/repository";

type DbResult = {
  articleId: ArticleId;
  userId: UserId;
  lastInteraction: Integer | null;
  isViewed: IsViewed;
  isLiked: IsLiked;
  learnProgressStage: LearnProgressStage;
};
@Injectable()
export class TotalInteractionRepositoryImpl implements TotalInteractionRepository {
  constructor(
    @Inject(NEO4J_TRANSACTION_TOKEN)
    private readonly tx: Transaction,
  ) {}

  private mapFromDb(record: Record<DbResult>): TotalInteraction {
    const r = record.toObject();
    return new TotalInteraction(
      r.articleId,
      r.userId,
      r.lastInteraction ? new LastInteraction(new Date(r.lastInteraction.toNumber())) : null,
      r.isViewed,
      r.isLiked,
      r.learnProgressStage,
    );
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
  async find(aId: ArticleId, uId: UserId): Promise<TotalInteraction> {
    await this.assertUserExists(uId);
    await this.assertArticleExists(aId);
    const result = await this.tx.run<DbResult>(
      `
      MATCH (a:Article {id: $aId}), (u:User {id: $uId})

      OPTIONAL MATCH (u)-[lp:LEARNS_PROGRESS]->(a)
      OPTIONAL MATCH (u)-[r:VIEWS|LIKES]->(a)

      WITH 
        a.id AS articleId,
        u.id AS userId,
        lp,
        MAX(r.timestamp) AS lastRelTs,
        EXISTS((u)-[:VIEWS]->(a)) AS isViewed,
        EXISTS((u)-[:LIKES]->(a)) AS isLiked

      WITH 
        articleId,
        userId,
        isViewed,
        isLiked,
        COALESCE(lp.learnProgressStage, "unknown") AS learnProgressStage,
        CASE 
          WHEN lp.updatedAt IS NOT NULL THEN lp.updatedAt
          WHEN lastRelTs IS NOT NULL THEN lastRelTs
          ELSE NULL
        END AS lastInteraction

      RETURN 
        articleId,
        userId,
        lastInteraction,
        isViewed,
        isLiked,
        learnProgressStage
      `,
      {
        aId,
        uId,
      },
    );

    return this.mapFromDb(result.records[0]);
  }
}