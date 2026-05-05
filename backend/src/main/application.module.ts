import { Module, Global, Inject } from '@nestjs/common';
import {
  SESSION_SERVICE_TOKEN,
  LOGIN_USE_CASE_TOKEN,
  DOMAIN_EVENT_DISPATCHER_TOKEN,
  USER_SERVICE_ADMIN_TOKEN,
  SESSION_SERVICE_LOGIN_TOKEN,
  SESSION_SERVICE_ADMIN_TOKEN,
  USER_SERVICE_PRIVATE_TOKEN,
  USER_SERVICE_PUBLIC_TOKEN,
  ARTICLE_SERVICE_ADMIN_TOKEN,
  ARTICLE_SERVICE_PRIVATE_TOKEN,
  ARTICLE_SERVICE_PUBLIC_TOKEN,
  TOTAL_INTERACTION_SERVICE_TOKEN,
  LEARN_PROGRESS_SERVICE_TOKEN,
  LIKE_SERVICE_TOKEN,
  VIEW_SERVICE_TOKEN,
  ARTICLE_SEARCH_INDEX_SERVICE_TOKEN,
  ARTICLE_SEARCH_SERVICE_TOKEN,
  ARTICLE_DAG_SERVICE_TOKEN,
  ARTICLE_PREVIEW_SERVICE_TOKEN,
  // Add other service tokens
} from '../tokens';
import { SessionService } from '../application/session/service';
import { LoginUseCase } from '../application/loginUseCase';
import { DomainModule } from './domain.module';
import { DomainEventDispatcherImpl } from '../implementations/application/common/events/dispatcher';
import { IDomainEventDispatcher } from '../application/common/events/dispatcher';
import { SessionServiceLogin } from '../application/session/serviceLogin';
import { SessionServiceAdmin } from '../application/session/serviceAdmin';
import { UserServiceAdmin } from '../application/user/admin/service';
import { UserServicePrivate } from '../application/user/private/service';
import { UserServicePublic } from '../application/user/public/service';
import { ArticleServiceAdmin } from '../application/article/admin/service';
import { ArticleServicePrivate } from '../application/article/private/service';
import { ArticleServicePublic } from '../application/article/public/service';
import { LearnProgressService } from '../application/interactionUserArticle/learnProgress/service';
import { LikeService } from '../application/interactionUserArticle/like/service';
import { ViewService } from '../application/interactionUserArticle/view/service';
import { TotalInteractionService } from '../application/interactionUserArticle/total/service';
import { ArticlePreviewService } from '../application/articlePreview/service';
import { ArticleCreatedHandler, ArticleDeletedHandler, ArticleUpdatedHandler } from '../application/search/articleEventsHandlers';
import { ArticleSearchIndexService, IArticleSearchIndexService } from '../application/search/indexingService';
import { ArticleSearchService } from '../application/search/service';
import { ArticleDAGService } from '../application/articleDAG/service';
// Add others e.g. LearnProgressService etc.

@Global()
@Module({
  imports: [
    DomainModule,

  ],
  providers: [
    { provide: SESSION_SERVICE_TOKEN, useClass: SessionService },
    { provide: SESSION_SERVICE_LOGIN_TOKEN, useClass: SessionServiceLogin},
    { provide: SESSION_SERVICE_ADMIN_TOKEN, useClass: SessionServiceAdmin},

    { provide: USER_SERVICE_ADMIN_TOKEN, useClass: UserServiceAdmin },
    { provide: USER_SERVICE_PRIVATE_TOKEN, useClass: UserServicePrivate },
    { provide: USER_SERVICE_PUBLIC_TOKEN, useClass: UserServicePublic },

    { provide: ARTICLE_SERVICE_ADMIN_TOKEN, useClass: ArticleServiceAdmin},
    { provide: ARTICLE_SERVICE_PRIVATE_TOKEN, useClass: ArticleServicePrivate},
    { provide: ARTICLE_SERVICE_PUBLIC_TOKEN, useClass: ArticleServicePublic},

    { provide: LOGIN_USE_CASE_TOKEN, useClass: LoginUseCase },

    { provide: DOMAIN_EVENT_DISPATCHER_TOKEN, useClass: DomainEventDispatcherImpl },

    { provide: LEARN_PROGRESS_SERVICE_TOKEN, useClass: LearnProgressService},
    { provide: LIKE_SERVICE_TOKEN, useClass: LikeService},
    { provide: VIEW_SERVICE_TOKEN, useClass: ViewService},
    { provide: TOTAL_INTERACTION_SERVICE_TOKEN, useClass: TotalInteractionService},

    { provide: ARTICLE_PREVIEW_SERVICE_TOKEN, useClass: ArticlePreviewService},

    { provide: ARTICLE_SEARCH_INDEX_SERVICE_TOKEN, useClass: ArticleSearchIndexService },
    { provide: ARTICLE_SEARCH_SERVICE_TOKEN, useClass: ArticleSearchService },

    { provide: ARTICLE_DAG_SERVICE_TOKEN, useClass: ArticleDAGService}
    // Add all other app services/use cases @Injectable from search_files results
  ],
  exports: [
    SESSION_SERVICE_TOKEN, SESSION_SERVICE_LOGIN_TOKEN, SESSION_SERVICE_ADMIN_TOKEN,
    USER_SERVICE_ADMIN_TOKEN, USER_SERVICE_PRIVATE_TOKEN, USER_SERVICE_PUBLIC_TOKEN,
    ARTICLE_SERVICE_ADMIN_TOKEN, ARTICLE_SERVICE_PRIVATE_TOKEN, ARTICLE_SERVICE_PUBLIC_TOKEN,
    LOGIN_USE_CASE_TOKEN, 
    
    DOMAIN_EVENT_DISPATCHER_TOKEN,

    LEARN_PROGRESS_SERVICE_TOKEN, LIKE_SERVICE_TOKEN, VIEW_SERVICE_TOKEN, TOTAL_INTERACTION_SERVICE_TOKEN,

    ARTICLE_PREVIEW_SERVICE_TOKEN,

    ARTICLE_SEARCH_SERVICE_TOKEN, ARTICLE_SEARCH_INDEX_SERVICE_TOKEN,

    ARTICLE_DAG_SERVICE_TOKEN
    // all others
  ],
})
export class ApplicationModule {
  constructor(
    @Inject(DOMAIN_EVENT_DISPATCHER_TOKEN) eventDispatcher: IDomainEventDispatcher,
    @Inject(ARTICLE_SEARCH_INDEX_SERVICE_TOKEN) articleSearchService: IArticleSearchIndexService
  ) {
    eventDispatcher.register(new ArticleCreatedHandler(articleSearchService))
    eventDispatcher.register(new ArticleUpdatedHandler(articleSearchService))
    eventDispatcher.register(new ArticleDeletedHandler(articleSearchService))
  }
}

