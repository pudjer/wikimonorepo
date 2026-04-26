import { ArticleId } from '../../article/props/articleId';
import { UserId } from '../../user/props/userId';
import { NotFoundError, UniqueError } from '../../common/domainErrors';
import { Like } from './entity';

export interface LikeRepository {
  findByUserId(uId: UserId): Promise<Like[]>;
  create(like: Like): Promise<Like>;
  delete(articleId: ArticleId, userId: UserId): Promise<true>;
}

export { UserNotFoundError } from '../../user/repository';
export { ArticleNotFoundError } from '../../article/repository';
