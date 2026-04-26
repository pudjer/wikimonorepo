import { Inject, Injectable } from "@nestjs/common";
import { ArticleCreatedEvent, ArticleCreatedEventKey, ArticleDeletedEvent, ArticleDeletedEventKey, ArticleUpdatedEvent, ArticleUpdatedEventKey } from "../../domain/article/events";
import { DomainEvent } from "../../domain/common/events/event";
import { IDomainEventHandler, InappropriateEventError } from "../common/events/handler";
import { IArticleSearchIndexService } from "./indexingService";
import { ARTICLE_SEARCH_INDEX_SERVICE_TOKEN } from "../../tokens";

@Injectable()
export class ArticleCreatedHandler implements IDomainEventHandler {
    public readonly listensTo = ArticleCreatedEventKey;
    constructor(
        @Inject(ARTICLE_SEARCH_INDEX_SERVICE_TOKEN) private readonly articleSearchService: IArticleSearchIndexService
    ) {}
    async handle(event: DomainEvent): Promise<void> {
        if(event instanceof ArticleCreatedEvent) {
            await this.articleSearchService.indexArticle(event.article);
        }else{
            throw new InappropriateEventError()
        }
    }
}
@Injectable()
export class ArticleUpdatedHandler implements IDomainEventHandler {
    public readonly listensTo = ArticleUpdatedEventKey;
    constructor(
        @Inject(ARTICLE_SEARCH_INDEX_SERVICE_TOKEN) private readonly articleSearchService: IArticleSearchIndexService
    ) {}
    async handle(event: DomainEvent): Promise<void> {
        if(event instanceof ArticleUpdatedEvent) {
            await this.articleSearchService.indexArticle(event.article);
        }else{
            throw new InappropriateEventError()
        }
    }
}

@Injectable()
export class ArticleDeletedHandler implements IDomainEventHandler {
    public readonly listensTo = ArticleDeletedEventKey;
    constructor(
        @Inject(ARTICLE_SEARCH_INDEX_SERVICE_TOKEN) private readonly articleSearchService: IArticleSearchIndexService
    ) {}
    async handle(event: DomainEvent): Promise<void> {
        if(event instanceof ArticleDeletedEvent) {
            await this.articleSearchService.removeArticleFromIndex(event.article.id);
        }else{
            throw new InappropriateEventError()
        }
    }
}