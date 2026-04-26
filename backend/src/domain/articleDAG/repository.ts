import { ArticleDAG, ArticleIdsUnique } from "./entity";

export interface ArticleDAGRepository{
    getDAG(articleIds: ArticleIdsUnique): Promise<ArticleDAG>
}

export { ArticleNotFoundError } from "../article/repository";