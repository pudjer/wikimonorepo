import { Integer, Transaction, Record } from "neo4j-driver";
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

// Метод find
async find(aId: ArticleId, uId: UserId): Promise<TotalInteraction> {
  await this.assertUserExists(uId);
  await this.assertArticleExists(aId);

  const result = await this.tx.run<DbResult>(
    `
    MATCH (a:Article {id: $aId}), (u:User {id: $uId})

    OPTIONAL MATCH (u)-[lp:LEARNS_PROGRESS]->(a)
    OPTIONAL MATCH (u)-[rel:VIEWS|LIKES]->(a)

    WITH
      a.id AS articleId,
      u.id AS userId,
      lp,
      max(rel.timestamp) AS lastRelTs,
      EXISTS((u)-[:VIEWS]->(a)) AS isViewed,
      EXISTS((u)-[:LIKES]->(a)) AS isLiked

    RETURN
      articleId,
      userId,
      CASE
        WHEN lp.updatedAt IS NOT NULL THEN lp.updatedAt
        WHEN lastRelTs IS NOT NULL THEN lastRelTs
        ELSE NULL
      END AS lastInteraction,
      isViewed,
      isLiked,
      COALESCE(lp.learnProgressStage, 'unknown') AS learnProgressStage
    `,
    { aId, uId },
  );

  return this.mapFromDb(result.records[0]);
}

// Метод findAllByUser
async findAllByUser(uId: UserId): Promise<TotalInteraction[]> {
  await this.assertUserExists(uId);

  const result = await this.tx.run<DbResult>(
    `
    MATCH (u:User {id: $uId})

    // Находим все статьи, с которыми у пользователя есть любое взаимодействие
    MATCH (u)-[:VIEWS|LIKES|LEARNS_PROGRESS]->(a:Article)

    WITH DISTINCT a, u

    OPTIONAL MATCH (u)-[lp:LEARNS_PROGRESS]->(a)
    OPTIONAL MATCH (u)-[v:VIEWS]->(a)
    OPTIONAL MATCH (u)-[l:LIKES]->(a)

    WITH
      a.id AS articleId,
      u.id AS userId,
      lp,
      // Собираем все временные метки в одну коллекцию и берём максимум
      REDUCE(
        maxTs = NULL,
        ts IN [lp.updatedAt, v.timestamp, l.timestamp] |
        CASE
          WHEN ts IS NULL THEN maxTs
          WHEN maxTs IS NULL THEN ts
          WHEN ts > maxTs THEN ts
          ELSE maxTs
        END
      ) AS lastInteraction,
      v IS NOT NULL AS isViewed,
      l IS NOT NULL AS isLiked

    RETURN
      articleId,
      userId,
      lastInteraction,
      isViewed,
      isLiked,
      COALESCE(lp.learnProgressStage, 'unknown') AS learnProgressStage
    `,
    { uId },
  );

  return result.records.map((record) => this.mapFromDb(record));
}
}
