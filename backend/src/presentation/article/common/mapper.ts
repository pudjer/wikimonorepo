import { ArticleType } from "../../../domain/article/entity";
import { ArticleReference } from "../../../domain/article/references";
import { ArticleResultDTO } from "./DTO";

export const resultMapper = (article: ArticleType): ArticleResultDTO => {
    return {
        id: article.id,
        authorId: article.authorId,
        title: article.title,
        content: article.content,
        links: Array.from(article.links.values).map((link: ArticleReference) => ({
            parent: link.parent,
            name: link.name,
        })),
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString(),
    };
};

