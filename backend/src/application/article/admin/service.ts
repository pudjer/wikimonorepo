import { Injectable, Inject } from "@nestjs/common";
import { ArticleType } from "../../../domain/article/entity";
import { ArticleDeletedEvent } from "../../../domain/article/events";
import { ArticleId } from "../../../domain/article/props/articleId";
import { ArticleRepository } from "../../../domain/article/repository";
import { ARTICLE_REPOSITORY_TOKEN, DOMAIN_EVENT_DISPATCHER_TOKEN } from "../../../tokens";
import { IDomainEventDispatcher } from "../../common/events/dispatcher";
import { UpdateArticleInputAdmin } from "./DTO";

export interface IArticleServiceAdmin {
    updateByAdmin(input: UpdateArticleInputAdmin, id: ArticleId): Promise<ArticleType>;
    deleteByAdmin(id: ArticleId): Promise<true>;
}

@Injectable()
export class ArticleServiceAdmin implements IArticleServiceAdmin {
    
    constructor(
        @Inject(ARTICLE_REPOSITORY_TOKEN) private readonly articleRepository: ArticleRepository,
        @Inject(DOMAIN_EVENT_DISPATCHER_TOKEN) private readonly eventDispatcher: IDomainEventDispatcher
    ) {}

    async updateByAdmin(input: UpdateArticleInputAdmin, id: ArticleId): Promise<ArticleType> {
        const article = await this.articleRepository.findById(id);
        return await this.commonUpdate(input, article);
    }

    async deleteByAdmin(id: ArticleId): Promise<true> {
        const article = await this.articleRepository.findById(id);
        return await this.commonDelete(article);
    }
    private async commonUpdate(input: UpdateArticleInputAdmin, article: ArticleType) {
        input.title && article.updateTitle(input.title);
        input.content && article.updateContent(input.content);
        input.links && article.updateLinks(input.links);

        const res = await this.articleRepository.update(article);

        await this.eventDispatcher.dispatchMany(res.GetDomainEvents());
        res.ClearDomainEvents()
        return res
    }
    private async commonDelete(article: ArticleType): Promise<true> {
        await this.articleRepository.delete(article.id);
        await this.eventDispatcher.dispatchMany([...article.GetDomainEvents(), new ArticleDeletedEvent(article)]);
        article.ClearDomainEvents()
        return true
    }
}