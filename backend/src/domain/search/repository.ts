import { ArticleType } from "../article/entity";
import { ArticleId } from "../article/props/articleId";
import { ArticleSearchQuery, ArticleSearchResult } from "./entity";

export interface ArticleSearchRepository {
    search(query: ArticleSearchQuery): Promise<ArticleSearchResult[]>;
    index(article: ArticleType): Promise<true>;
    removeFromIndex(articleId: ArticleId): Promise<true>;
}

export { ArticleNotFoundError } from "../article/repository";