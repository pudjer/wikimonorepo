import { Module } from "@nestjs/common";
import { ArticleControllerAdmin } from "../presentation/article/admin/controller";
import { ArticleControllerPrivate } from "../presentation/article/private/controller";
import { ArticleControllerPublic } from "../presentation/article/public/controller";
import { LoginController } from "../presentation/session/loginController";
import { SessionController } from "../presentation/session/controller";
import { SessionControllerAdmin } from "../presentation/session/adminController";
import { UserControllerAdmin } from "../presentation/user/admin/controller";
import { UserControllerPrivate } from "../presentation/user/private/controller";
import { UserControllerPublic } from "../presentation/user/public/controller";
import { InteractionUserArticleController } from "../presentation/interactionUserArticle/controller";
import { SearchControllerPublic } from "../presentation/search/controller";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { AppExceptionFilter } from "../presentation/common/exceptionFilter";
import { ArticleDAGController } from "../presentation/articleDAG/controller";
import { ArticlePreviewControllerPublic } from "../presentation/articlePreview/controller";
import { AuthInterceptor } from "../presentation/common/auth/sessionInterceptor";
import { DomainModule } from "./domain.module";

@Module({
  imports: [DomainModule],
  controllers: [
    ArticleControllerAdmin, ArticleControllerPrivate, ArticleControllerPublic,
    LoginController, SessionController, SessionControllerAdmin,
    UserControllerPublic, UserControllerPrivate, UserControllerAdmin,
    InteractionUserArticleController, ArticlePreviewControllerPublic,
    SearchControllerPublic,
    ArticleDAGController
  ],
  providers: [
    AuthInterceptor,
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter
    }
  ],
})
export class PresentationModule {}
