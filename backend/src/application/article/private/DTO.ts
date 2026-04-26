import { Content } from "../../../domain/article/props/content"
import { Title } from "../../../domain/article/props/title"
import { ArticleReferences } from "../../../domain/article/references"

export interface CreateArticleInputPrivate {
    title: Title
    content: Content
    links: ArticleReferences
}
export interface UpdateArticleInputFullPrivate {
    title: Title
    content: Content
    links: ArticleReferences
}

export type UpdateArticleInputPrivate = Partial<UpdateArticleInputFullPrivate>;
