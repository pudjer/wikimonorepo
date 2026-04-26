import { ArticleId } from '../article/props/articleId';
import { ArticleStatistic, Order, OrderingProp } from './entity';

export interface ArticleStatisticRepository {
  findById(aId: ArticleId): Promise<ArticleStatistic>;
  findByIds(aIds: ArticleId[]): Promise<ArticleStatistic[]>;
  getInOrder(orderBy: OrderingProp, order: Order): Promise<ArticleStatistic[]>
}

export { ArticleNotFoundError } from '../article/repository';


