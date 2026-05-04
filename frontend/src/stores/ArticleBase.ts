import { ArticleStatistic, getArticleStatisticKey } from "./ArticleStatistic";
import { Author, getAuthorKey } from "./Author";
import { resolver } from "./storeConfig";

export class ArticleBase{
  id: string;
  authorId: string;
  async getAuthor(): Promise<Author> {
    return await resolver.resolveOutside<Author>(getAuthorKey(this.authorId));
  }
  async getStatistics(): Promise<ArticleStatistic> {
    return await resolver.resolveOutside<ArticleStatistic>(getArticleStatisticKey(this.id));
  }
}