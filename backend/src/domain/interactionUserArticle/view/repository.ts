import { ArticleId } from '../../article/props/articleId';
import { UserId } from '../../user/props/userId';
import { NotFoundError } from '../../common/domainErrors';
import { Timestamp, View } from './entity';

export interface ViewRepository {
  findByUserId(uId: UserId): Promise<View[]>;
  create(view: View): Promise<View>;
  delete(articleId: ArticleId, userId: UserId): Promise<true>;
}

export { UserNotFoundError } from '../../user/repository';
export { ArticleNotFoundError } from '../../article/repository';
