import { ArticleId } from "../article/props/articleId";
import { ArticleToArticleLinkName } from "../article/references";
import { Link, UniqueLinkCollection } from "../common/entity";

type ChildToParent<Node, LinkName> = Link<Node, LinkName, Node>
export type NodeRelations<Node, LinkName> = UniqueLinkCollection<ChildToParent<Node, LinkName>>
export type ArticleRelations = NodeRelations<ArticleId, ArticleToArticleLinkName>


export type ArticleIdsUnique = ReadonlySet<ArticleId>
export class ArticleDAG{
    constructor(
        public readonly links: ArticleRelations,
        public readonly nodes: ArticleIdsUnique,
    ){}
}