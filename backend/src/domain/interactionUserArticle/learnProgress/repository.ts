import { ArticleId } from '../../article/props/articleId';
import { UserId } from '../../user/props/userId';
import { LearnProgress } from './entity';

export interface LearnProgressRepository {
  findByUserId(uId: UserId): Promise<LearnProgress[]>;
  update(Learned: LearnProgress): Promise<LearnProgress>;
}

export { UserNotFoundError } from '../../user/repository';
export { ArticleNotFoundError } from '../../article/repository';
