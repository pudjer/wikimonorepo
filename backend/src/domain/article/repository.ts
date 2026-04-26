import { LinksCycleError, NotFoundError } from '../common/domainErrors';
import { ArticleType } from './entity';
import { ArticleId } from './props/articleId';

export interface ArticleRepository {
  findById(id: ArticleId): Promise<ArticleType>;
  findByAuthorId(userId: string): Promise<ArticleId[]>;
  create(article: ArticleType): Promise<ArticleType>;
  update(article: ArticleType): Promise<ArticleType>;
  delete(id: ArticleId): Promise<true>;
}

export class ArticleNotFoundError extends NotFoundError{}
export class ArticleInLinkNotFoundError extends ArticleNotFoundError{}
export class AuthorNotFoundError extends NotFoundError{}
export class ArticleLinksCycleError extends LinksCycleError<ArticleId>{}
