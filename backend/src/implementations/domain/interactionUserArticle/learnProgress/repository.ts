import { Integer, Transaction } from "neo4j-driver";
import { Inject, Injectable } from "@nestjs/common";
import { NEO4J_TRANSACTION_TOKEN } from "../../../../tokens";
import { UserId } from "../../../../domain/user/props/userId";
import { LearnProgress, LearnProgressStage, UpdatedAt } from "../../../../domain/interactionUserArticle/learnProgress/entity";
import { ArticleId } from "../../../../domain/article/props/articleId";
import { Record } from "neo4j-driver";
import { ArticleNotFoundError, LearnProgressRepository, UserNotFoundError } from "../../../../domain/interactionUserArticle/learnProgress/repository";


type FindResult = {
  articleId: ArticleId;
  userId: UserId;
  learnProgressStage: LearnProgressStage;
  updatedAt: Integer;
}

@Injectable()
export class LearnProgressRepositoryImpl implements LearnProgressRepository {
constructor(@Inject(NEO4J_TRANSACTION_TOKEN) private readonly tx: Transaction) {}
  mapFromDb(record: Record<FindResult>) {
    const r = record.toObject();
    return new LearnProgress(
      r.articleId,
      r.userId,
      r.learnProgressStage,
      new UpdatedAt(new Date(r.updatedAt.toNumber())),
    );
  }
  mapToDb(learnProgress: LearnProgress): FindResult {
    return {
      articleId: learnProgress.articleId,
      userId: learnProgress.userId,
      learnProgressStage: learnProgress.learnProgressStage,
      updatedAt: Integer.fromNumber(learnProgress.updatedAt.getTime()),
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

  async findByUserId(uId: UserId): Promise<LearnProgress[]> {
    await this.assertUserExists(uId);
    const result = await this.tx.run<FindResult>(
      `MATCH (u:User {id: $uId})- [r:LEARNS_PROGRESS]->(a:Article)
       RETURN a.id AS articleId, r.learnProgressStage AS learnProgressStage, r.updatedAt AS updatedAt, u.id AS userId`,
      { uId }
    );

    return result.records.map(r=>this.mapFromDb(r));
  }

  async update(learnProgress: LearnProgress): Promise<LearnProgress> {
    await this.assertUserExists(learnProgress.userId);
    await this.assertArticleExists(learnProgress.articleId);
    const mapped = this.mapToDb(learnProgress);
    if(learnProgress.learnProgressStage === LearnProgressStage.Unknown){
      await this.tx.run<{ deleted: Integer }>(
        `MATCH (u:User {id: $userId})-[r:LEARNS_PROGRESS]->(a:Article {id: $articleId})
        DELETE r`,
        mapped
      )
      return learnProgress;
    }else{
      const result = await this.tx.run<FindResult>(
        `MATCH (u:User {id: $userId})
        MATCH (a:Article {id: $articleId})
        MERGE (u)-[r:LEARNS_PROGRESS]->(a)
        SET r.learnProgressStage = $learnProgressStage, r.updatedAt = $updatedAt
        RETURN a.id AS articleId, r.learnProgressStage AS learnProgressStage, r.updatedAt AS updatedAt, u.id AS userId`,
        mapped
      );
      return this.mapFromDb(result.records[0]);
    }

  }
}

