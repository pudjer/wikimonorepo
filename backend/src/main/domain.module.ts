import { Module, Global, Scope } from '@nestjs/common';
import {
  USER_REPOSITORY_TOKEN,
  ARTICLE_REPOSITORY_TOKEN,
  LIKE_REPOSITORY_TOKEN,
  VIEW_REPOSITORY_TOKEN,
  LEARN_PROGRESS_REPOSITORY_TOKEN,
  TOTAL_INTERACTION_REPOSITORY_TOKEN,

  SESSION_REPOSITORY_TOKEN,
  USER_ID_FACTORY_TOKEN,
  ARTICLE_ID_FACTORY_TOKEN,
  SESSION_ID_FACTORY_TOKEN,
  USER_ID_VALIDATOR_TOKEN,
  ARTICLE_ID_VALIDATOR_TOKEN,
  SESSION_ID_VALIDATOR_TOKEN,
  USERNAME_VALIDATOR_TOKEN,
  PASSWORD_VALIDATOR_TOKEN,
  TITLE_VALIDATOR_TOKEN,
  CONTENT_VALIDATOR_TOKEN,
  ARTICLE_TO_ARTICLE_LINK_NAME_VALIDATOR,
  ARTICLE_REFERENCES_VALIDATOR,
  HASHER_TOKEN,
  ARTICLE_FACTORY_TOKEN,
  SESSION_FACTORY_TOKEN,
  USER_FACTORY_TOKEN,
  ARTICLE_STATISTIC_REPOSITORY_TOKEN,
  QUERY_VALIDATOR_TOKEN,
  ARTICLE_SEARCH_REPOSITORY_TOKEN,
  ARTICLE_DAG_REPOSITORY_TOKEN,
} from '../tokens';
import { ArticleRepositoryImpl } from '../implementations/domain/article/repository';
import { LikeRepositoryImpl } from '../implementations/domain/interactionUserArticle/like/repository';
import { ViewRepositoryImpl } from '../implementations/domain/interactionUserArticle/view/repository';
import { LearnProgressRepositoryImpl } from '../implementations/domain/interactionUserArticle/learnProgress/repository';
import { TotalInteractionRepositoryImpl } from '../implementations/domain/interactionUserArticle/total/repository';
import { SessionRepositoryImpl } from '../implementations/domain/session/repository';
import { UserRepositoryImpl } from '../implementations/domain/user/repository';
// Add other repo impls: e.g. ArticleSearchRepositoryImpl from implementations/domain/search/repository.ts etc.
import { DomainEventDispatcherImpl } from '../implementations/application/common/events/dispatcher';
// Import all validator/factory impl classes from implementations/domain/*/props/*.ts etc.
import { UserIdFactoryImpl, UserIdValidatorImpl } from '../implementations/domain/user/props/userId';
import { UsernameValidatorImpl } from '../implementations/domain/user/props/username';
import { PasswordValidatorImpl, HasherImpl } from '../implementations/domain/user/props/password';
import { SessionIdValidatorImpl, SesssionIdFactoryImpl } from '../implementations/domain/session/props/sessionId';
import { ArticleIdFactoryImpl, ArticleIdValidatorImpl } from '../implementations/domain/article/props/articleId';
import { TitleValidatorImpl } from '../implementations/domain/article/props/title';
import { ContentValidatorImpl } from '../implementations/domain/article/props/content';
import { ArticleToArticleLinkNameValidatorImpl } from '../implementations/domain/article/link';
import { QueryTextValidatorImpl } from '../implementations/domain/search/props/query';
import { ArticleSearchRepositoryImpl } from '../implementations/domain/search/repository';
import { ArticleFactory } from '../domain/article/entity';
import { ArticleReferencesValidator } from '../domain/article/references';
import { SessionFactory } from '../domain/session/entity';
import { UserFactory } from '../domain/user/entity';
import { ArticleStatisticRepositoryImpl } from '../implementations/domain/articleStatistic/repository';
import { ArticleDAGRepositoryImpl } from '../implementations/domain/articleDAG/repository';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';


@Global()
@Module({
  imports: [    
    InfrastructureModule,
  ],
  providers: [
    // Factories & Validators (DEFAULT scope)
    { provide: USER_ID_FACTORY_TOKEN, useClass: UserIdFactoryImpl },
    { provide: ARTICLE_ID_FACTORY_TOKEN, useClass: ArticleIdFactoryImpl },
    { provide: SESSION_ID_FACTORY_TOKEN, useClass: SesssionIdFactoryImpl },

    { provide: USER_ID_VALIDATOR_TOKEN, useClass: UserIdValidatorImpl },
    { provide: ARTICLE_ID_VALIDATOR_TOKEN, useClass: ArticleIdValidatorImpl },
    { provide: SESSION_ID_VALIDATOR_TOKEN, useClass: SessionIdValidatorImpl },
    { provide: USERNAME_VALIDATOR_TOKEN, useClass: UsernameValidatorImpl },
    { provide: PASSWORD_VALIDATOR_TOKEN, useClass: PasswordValidatorImpl },
    { provide: TITLE_VALIDATOR_TOKEN, useClass: TitleValidatorImpl },
    { provide: CONTENT_VALIDATOR_TOKEN, useClass: ContentValidatorImpl },
    { provide: QUERY_VALIDATOR_TOKEN, useClass: QueryTextValidatorImpl },
    { provide: ARTICLE_TO_ARTICLE_LINK_NAME_VALIDATOR, useClass: ArticleToArticleLinkNameValidatorImpl },
    { provide: ARTICLE_SEARCH_REPOSITORY_TOKEN, useClass: ArticleSearchRepositoryImpl },

    { provide: ARTICLE_REFERENCES_VALIDATOR, useClass: ArticleReferencesValidator }, // from domain/article/references.ts
    { provide: HASHER_TOKEN, useClass: HasherImpl },
    { provide: ARTICLE_FACTORY_TOKEN, useClass: ArticleFactory },
    { provide: SESSION_FACTORY_TOKEN, useClass: SessionFactory },
    { provide: USER_FACTORY_TOKEN, useClass: UserFactory },
    // Repositories (TRANSIENT)
    { provide: USER_REPOSITORY_TOKEN, useClass: UserRepositoryImpl },
    { provide: ARTICLE_REPOSITORY_TOKEN, useClass: ArticleRepositoryImpl },
    { provide: SESSION_REPOSITORY_TOKEN, useClass: SessionRepositoryImpl },

    { provide: LIKE_REPOSITORY_TOKEN, useClass: LikeRepositoryImpl },
    { provide: VIEW_REPOSITORY_TOKEN, useClass: ViewRepositoryImpl },
    { provide: LEARN_PROGRESS_REPOSITORY_TOKEN, useClass: LearnProgressRepositoryImpl },
    { provide: TOTAL_INTERACTION_REPOSITORY_TOKEN, useClass: TotalInteractionRepositoryImpl },

    { provide: ARTICLE_STATISTIC_REPOSITORY_TOKEN, useClass: ArticleStatisticRepositoryImpl},

    { provide: ARTICLE_DAG_REPOSITORY_TOKEN, useClass: ArticleDAGRepositoryImpl},
  ],
  exports: [
    USER_REPOSITORY_TOKEN, ARTICLE_REPOSITORY_TOKEN, SESSION_REPOSITORY_TOKEN, /* all repos */
    USER_ID_VALIDATOR_TOKEN,
    ARTICLE_ID_VALIDATOR_TOKEN,
    SESSION_ID_VALIDATOR_TOKEN,
    USER_ID_FACTORY_TOKEN,
    ARTICLE_ID_FACTORY_TOKEN,
    SESSION_ID_FACTORY_TOKEN,
    USERNAME_VALIDATOR_TOKEN,
    PASSWORD_VALIDATOR_TOKEN,
    TITLE_VALIDATOR_TOKEN,
    CONTENT_VALIDATOR_TOKEN,
    ARTICLE_TO_ARTICLE_LINK_NAME_VALIDATOR,
    ARTICLE_REFERENCES_VALIDATOR,
    HASHER_TOKEN,
    ARTICLE_FACTORY_TOKEN,
    SESSION_FACTORY_TOKEN,
    USER_FACTORY_TOKEN,
    LEARN_PROGRESS_REPOSITORY_TOKEN,
    LIKE_REPOSITORY_TOKEN,
    VIEW_REPOSITORY_TOKEN,
    TOTAL_INTERACTION_REPOSITORY_TOKEN,
    ARTICLE_STATISTIC_REPOSITORY_TOKEN,
    QUERY_VALIDATOR_TOKEN,
    ARTICLE_SEARCH_REPOSITORY_TOKEN,
    ARTICLE_DAG_REPOSITORY_TOKEN

  ],
})
export class DomainModule {}

