import { ArticleId } from '../article/props/articleId';
import { ArticlePreview, PreviewOrder, PreviewOrderingProp } from './entity';

export interface ArticlePreviewRepository {
  findById(aId: ArticleId): Promise<ArticlePreview>;
  findByIds(aIds: ArticleId[]): Promise<ArticlePreview[]>;
  getInOrder(orderBy: PreviewOrderingProp, order: PreviewOrder): Promise<ArticlePreview[]>
}

export { ArticleNotFoundError } from '../article/repository';


