import { Content } from "../../../domain/article/props/content";
import { Title } from "../../../domain/article/props/title";
import { ArticleReferences } from "../../../domain/article/references";

export interface UpdateArticleInputFullAdmin {
    title: Title
    content: Content
    links: ArticleReferences
}

export type UpdateArticleInputAdmin = Partial<UpdateArticleInputFullAdmin>;