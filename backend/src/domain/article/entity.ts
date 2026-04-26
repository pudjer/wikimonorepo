import { Title } from "./props/title";
import { Content } from "./props/content";
import { ArticleId, ArticleIdFactory, ArticleIdValidator } from "./props/articleId";
import { UserId } from "../user/props/userId";
import { PastOrPresentDateVO } from "../utils/valueObjects";
import { AuthorityError, AppError, LinksCycleError } from "../common/domainErrors";
import { DomainEvent } from "../common/events/event";
import { IHasDomainEvents } from "../common/events/IHasDomainEvents";
import { ArticleCreatedEvent, ArticleCreatedEventKey, ArticleUpdatedEvent, ArticleUpdatedEventKey } from "./events";
import { ArticleReferences, ArticleToArticleLinkName } from "./references";
import { Inject, Injectable } from "@nestjs/common";
import { ARTICLE_ID_FACTORY_TOKEN } from "../../tokens";


declare const UpdatedAtSymbol: unique symbol;
export class UpdatedAt extends PastOrPresentDateVO<typeof UpdatedAtSymbol>{}
declare const CreatedAtSymbol: unique symbol;
export class CreatedAt extends PastOrPresentDateVO<typeof CreatedAtSymbol>{}

export type ArticleType = Article
class Article implements IHasDomainEvents {
  private _title: Title;
  private _content: Content;
  private _links: ArticleReferences;
  private _updatedAt: UpdatedAt;

  private _domainEvents = new Map<string, DomainEvent>();

  constructor(
    public readonly id: ArticleId,
    public readonly authorId: UserId,
    title: Title,
    content: Content,
    links: ArticleReferences,
    public readonly createdAt: CreatedAt,
    updatedAt: UpdatedAt,
  ) {
    this._title = title;
    this._content = content;
    this.assertNoSelfReferences(links);
    this._links = links;
    this._updatedAt = updatedAt;
  }
  private assertNoSelfReferences(links: ArticleReferences): true {
    const selfReferences: ArticleToArticleLinkName[]  = []
    for (const link of links.values) {
      if (link.parent === this.id) {
        selfReferences.push(link.name);
      }
    }
    if (selfReferences.length > 0) {
      throw new SelfReferenceError(selfReferences);
    }
    return true
  }
  public GetDomainEvents(): DomainEvent[] {
    return Array.from(this._domainEvents.values());
  }
  public ClearDomainEvents(): void {
    this._domainEvents.clear();
  }
  public AddCreateEvent(): void {
    this._domainEvents.set(ArticleCreatedEventKey, new ArticleCreatedEvent(this));
  }
  
  // ==========================
  // Геттеры
  // ==========================
  public get title(): Title {
    return this._title;
  }

  public get content(): Content {
    return this._content;
  }

  public get links(): ArticleReferences {
    return this._links;
  }

  public get updatedAt(): UpdatedAt {
    return this._updatedAt;
  }


  private updatedNow(): void {
    this._updatedAt = new UpdatedAt(new Date());
    this._domainEvents.set(ArticleUpdatedEventKey, new ArticleUpdatedEvent(this));
  }

  public assertAuthor(userId: UserId): true {
    if (this.authorId === userId) {
      return true;
    }
    throw new ArticleAuthorityError();
  }
  // ==========================
  // Методы изменения
  // ==========================
  public updateContent(newContent: Content): void {
    this._content = newContent;
    this.updatedNow();
  }

  public updateTitle(newTitle: Title): void {
    this._title = newTitle;
    this.updatedNow();    
  }

  public updateLinks(links: ArticleReferences): void {
    this.assertNoSelfReferences(links);
    this._links = links;
    this.updatedNow();
  }

}

// ==========================
// Ошибки
// ==========================
export class ArticleAuthorityError extends AuthorityError{}
export class SelfReferenceError extends LinksCycleError<ArticleToArticleLinkName>{}
// ==========================
// Фабрика
// ==========================
@Injectable()
export class ArticleFactory {
  constructor(
    @Inject(ARTICLE_ID_FACTORY_TOKEN) private readonly articleIdFactory: ArticleIdFactory
  ) {}

  async createNew(
    authorId: UserId,
    title: Title,
    content: Content,
    links: ArticleReferences
  ): Promise<ArticleType> {
    const id = await this.articleIdFactory.createNew();
    const nowUpdated = new UpdatedAt(new Date());
    const nowCreated = new CreatedAt(new Date());
    const article =  new Article(
      id,
      authorId,
      title,
      content,
      links,
      nowCreated,
      nowUpdated
    );
    article.AddCreateEvent();
    return article;
  }

  createExisting(
    id: ArticleId,
    authorId: UserId,
    title: Title,
    content: Content,
    links: ArticleReferences,
    createdAt: CreatedAt,
    updatedAt: UpdatedAt
  ): ArticleType {
    const article =  new Article(
      id,
      authorId,
      title,
      content,
      links,
      createdAt,
      updatedAt
    );
    return article;
  }
}