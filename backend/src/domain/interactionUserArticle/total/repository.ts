import { ArticleId } from '../../article/props/articleId';
import { UserId } from '../../user/props/userId';
import { TotalInteraction } from './entity';




export interface TotalInteractionRepository {
  find(aId: ArticleId, uId: UserId): Promise<TotalInteraction>;
}



export { UserNotFoundError } from '../../user/repository';
export { ArticleNotFoundError } from '../../article/repository';