import { Injectable, Inject } from "@nestjs/common";
import { ArticleType, ArticleFactory } from "../../../domain/article/entity";
import { ArticleDeletedEvent } from "../../../domain/article/events";
import { ArticleId } from "../../../domain/article/props/articleId";
import { ArticleRepository } from "../../../domain/article/repository";
import { UserId } from "../../../domain/user/props/userId";
import { ARTICLE_REPOSITORY_TOKEN, ARTICLE_FACTORY_TOKEN, DOMAIN_EVENT_DISPATCHER_TOKEN } from "../../../tokens";
import { IDomainEventDispatcher } from "../../common/events/dispatcher";
import { UpdateArticleInputPrivate, CreateArticleInputPrivate } from "./DTO";

export interface IArticleServicePrivate {
    create(input: CreateArticleInputPrivate, userId: UserId): Promise<ArticleType>;
    update(input: UpdateArticleInputPrivate, id: ArticleId, userId: UserId): Promise<ArticleType>;
    delete(id: ArticleId, userId: UserId): Promise<true>;
}

@Injectable()
export class ArticleServicePrivate implements IArticleServicePrivate {
    
    constructor(
        @Inject(ARTICLE_REPOSITORY_TOKEN) private readonly articleRepository: ArticleRepository,
        @Inject(ARTICLE_FACTORY_TOKEN) private readonly articleFactory: ArticleFactory,
        @Inject(DOMAIN_EVENT_DISPATCHER_TOKEN) private readonly eventDispatcher: IDomainEventDispatcher
    ) {}
    private async commonUpdate(input: UpdateArticleInputPrivate, article: ArticleType) {
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
    async update(input: UpdateArticleInputPrivate, id: ArticleId, userId: UserId): Promise<ArticleType> {
        const article = await this.articleRepository.findById(id);
        article.assertAuthor(userId);
        return await this.commonUpdate(input, article);
    }
    async delete(id: ArticleId, userId: UserId): Promise<true> {
        const article = await this.articleRepository.findById(id);
        article.assertAuthor(userId);
        return await this.commonDelete(article);
    }
    async create(input: CreateArticleInputPrivate, userId: UserId): Promise<ArticleType> {
        const article = await this.articleFactory.createNew(userId, input.title, input.content, input.links);
        const res = await this.articleRepository.create(article);
        await this.eventDispatcher.dispatchMany(res.GetDomainEvents());
        res.ClearDomainEvents()
        return res
    }
}