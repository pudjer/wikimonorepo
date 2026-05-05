import { Inject } from "@nestjs/common";
import { Transaction, Record, Integer } from "neo4j-driver";
import { ArticleId } from "../../../domain/article/props/articleId";
import { ArticlePreview, ViewsNumber, LikesNumber, Learners, Masters, DagPoints, PreviewOrderingProp, PreviewOrder } from "../../../domain/articlePreview/entity";
import { ArticleNotFoundError, ArticlePreviewRepository } from "../../../domain/articlePreview/repository";
import { NEO4J_TRANSACTION_TOKEN } from "../../../tokens";
import { Title } from "../../../domain/article/props/title";
import { UserId } from "../../../domain/user/props/userId";

type FindResult = {
  id: ArticleId;
  title: Title;
  authorId: UserId;
  views: Integer | null;
  likes: Integer | null;
  learners: Integer | null;
  masters: Integer | null;
  dagPoints: Integer | null;
};

export class ArticlePreviewRepositoryImpl
  implements ArticlePreviewRepository
{
  constructor(
    @Inject(NEO4J_TRANSACTION_TOKEN)
    private readonly tx: Transaction
  ) {}

  private mapFromRecord(record: Record<FindResult>): ArticlePreview {
    const r = record.toObject();

    return new ArticlePreview(
      r.id,
      r.title,
      r.authorId,
      new ViewsNumber(r.views ? r.views.toNumber() : 0),
      new LikesNumber(r.likes ? r.likes.toNumber() : 0),
      new Learners(r.learners ? r.learners.toNumber() : 0),
      new Masters(r.masters ? r.masters.toNumber() : 0),
      new DagPoints(r.dagPoints ? r.dagPoints.toNumber() : 0)
    );
  }

  async findById(aId: ArticleId): Promise<ArticlePreview> {
    const res = await this.tx.run<FindResult>(
      `
      MATCH (a:Article {id: $articleId})-[:AUTHORED_BY]->(u:User)
      RETURN 
        a.id AS id,
        a.title AS title,
        u.id AS authorId,
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

  async findByIds(aIds: ArticleId[]): Promise<ArticlePreview[]> {
    const res = await this.tx.run<FindResult>(
      `
      MATCH (a:Article)-[:AUTHORED_BY]->(u:User)
      WHERE a.id IN $articleIds
      RETURN 
        a.id AS id,
        a.title AS title,
        u.id AS authorId,
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
    orderBy: PreviewOrderingProp,
    order: PreviewOrder
  ): Promise<ArticlePreview[]> {
    const direction = order;

    const res = await this.tx.run<FindResult>(
      `
        MATCH (a:Article)-[:AUTHORED_BY]->(u:User)
        RETURN 
          a.id AS id,
          a.title AS title,
          u.id AS authorId,
          a.views AS views,
          a.likes AS likes,
          a.learners AS learners,
          a.masters AS masters,
          a.dagPoints AS dagPoints
          ORDER BY a.${orderBy} ${direction}
      `
    );

    return res.records.map((r) => this.mapFromRecord(r));
  }
}
