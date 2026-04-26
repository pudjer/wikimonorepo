import { Inject } from "@nestjs/common";
import { Transaction, Record, Integer } from "neo4j-driver";
import { ArticleId } from "../../../domain/article/props/articleId";
import { ArticleStatistic, ViewsNumber, LikesNumber, Learners, Masters, DagPoints, OrderingProp, Order } from "../../../domain/articleStatistic/entity";
import { ArticleNotFoundError, ArticleStatisticRepository } from "../../../domain/articleStatistic/repository";
import { NEO4J_TRANSACTION_TOKEN } from "../../../tokens";



type FindResult = {
  articleId: ArticleId;
  views: Integer | null;
  likes: Integer | null;
  learners: Integer | null;
  masters: Integer | null;
  dagPoints: Integer | null;
};

export class ArticleStatisticRepositoryImpl
  implements ArticleStatisticRepository
{
  constructor(
    @Inject(NEO4J_TRANSACTION_TOKEN)
    private readonly tx: Transaction
  ) {}

  private mapFromRecord(record: Record<FindResult>): ArticleStatistic {
    const r = record.toObject();

    return new ArticleStatistic(
      r.articleId,
      new ViewsNumber(r.views ? r.views.toNumber() : 0),
      new LikesNumber(r.likes ? r.likes.toNumber() : 0),
      new Learners(r.learners ? r.learners.toNumber() : 0),
      new Masters(r.masters ? r.masters.toNumber() : 0),
      new DagPoints(r.dagPoints ? r.dagPoints.toNumber() : 0)
    );
  }

  async findById(aId: ArticleId): Promise<ArticleStatistic> {
    const res = await this.tx.run<FindResult>(
      `
      MATCH (a:Article {id: $articleId})
      RETURN 
        a.id AS articleId,
        a.views AS views,
        a.likes AS likes,
        a.learners AS learners,
        a.masters AS masters,
        a.dagPoints AS dagPoints
      `,
      { articleId: aId }
    );

    const record = res.records[0];
    if (!record) {
      throw new ArticleNotFoundError();
    }
    return this.mapFromRecord(record);
  }

  async findByIds(aIds: ArticleId[]): Promise<ArticleStatistic[]> {
    const res = await this.tx.run<FindResult>(
      `
      MATCH (a:Article)
      WHERE a.id IN $articleIds
      RETURN 
        a.id AS articleId,
        a.views AS views,
        a.likes AS likes,
        a.learners AS learners,
        a.masters AS masters,
        a.dagPoints AS dagPoints
      `,
      { articleIds: aIds }
    );

    return res.records.map((r) => this.mapFromRecord(r));
  }

  async getInOrder(
    orderBy: OrderingProp,
    order: Order
  ): Promise<ArticleStatistic[]> {
    const direction = order;

    const res = await this.tx.run<FindResult>(
      `
        MATCH (a:Article)
        RETURN 
          a.id AS articleId,
          a.views AS views,
          a.likes AS likes,
          a.learners AS learners,
          a.masters AS masters,
          a.dagPoints AS dagPoints
          ORDER BY ${orderBy} ${direction}
      `
    );

    return res.records.map((r) => this.mapFromRecord(r));
  }


}