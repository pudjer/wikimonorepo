import { DomainEvent } from "../common/events/event";
import { ArticleType } from "./entity";


export const ArticleCreatedEventKey = 'AddCreateEvent';
export class ArticleCreatedEvent extends DomainEvent {
    constructor(
        public readonly article: ArticleType
    ){
        super(ArticleCreatedEventKey);
    }
}
export const ArticleUpdatedEventKey = 'ArticleUpdatedEvent';
export class ArticleUpdatedEvent extends DomainEvent {
    constructor(
        public readonly article: ArticleType
    ){
        super(ArticleUpdatedEventKey);
    }
}

export const ArticleDeletedEventKey = 'ArticleDeletedEvent';
export class ArticleDeletedEvent extends DomainEvent {
    constructor(
        public readonly article: ArticleType
    ){
        super(ArticleDeletedEventKey);
    }
}