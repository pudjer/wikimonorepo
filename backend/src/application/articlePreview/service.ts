import { Inject, Injectable } from "@nestjs/common";
import { ArticleId } from "../../domain/article/props/articleId";
import { ArticlePreview, PreviewOrder, PreviewOrderingProp } from "../../domain/articlePreview/entity";
import { ArticlePreviewRepository } from "../../domain/articlePreview/repository";
import { ARTICLE_PREVIEW_REPOSITORY_TOKEN } from "../../tokens";

export interface IArticlePreviewService {
    getByArticleId(aId: ArticleId): Promise<ArticlePreview>
    getByArticleIds(aIds: ArticleId[]): Promise<ArticlePreview[]>
    getInOrder(orderBy: PreviewOrderingProp, order: PreviewOrder): Promise<ArticlePreview[]>
}

@Injectable()
export class ArticlePreviewService implements IArticlePreviewService {
    constructor(
        @Inject(ARTICLE_PREVIEW_REPOSITORY_TOKEN) private readonly articlePreviewRepository: ArticlePreviewRepository
    ){}
    async getByArticleId(aId: ArticleId): Promise<ArticlePreview> {
        return await this.articlePreviewRepository.findById(aId)
    }
    async getByArticleIds(aIds: ArticleId[]): Promise<ArticlePreview[]> {
        return await this.articlePreviewRepository.findByIds(aIds)
    }
    async getInOrder(orderBy: PreviewOrderingProp, order: PreviewOrder): Promise<ArticlePreview[]> {
        return await this.articlePreviewRepository.getInOrder(orderBy, order)
    }
}
