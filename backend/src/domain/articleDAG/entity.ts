import { ArticleId } from "../article/props/articleId";
import { ArticleToArticleLinkName } from "../article/references";
import { NodeRelations } from "../DAG/entity";

export type ArticleRelations = NodeRelations<ArticleId, ArticleToArticleLinkName>
export type ArticleIdsUnique = ReadonlySet<ArticleId>
export class ArticleDAG{
    constructor(
        public readonly links: ArticleRelations,
        public readonly nodes: ArticleIdsUnique,
    ){}
}