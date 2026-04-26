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
import { ArticleStatisticControllerPublic } from "../presentation/articleStatistic/controller";
import { SearchControllerPublic } from "../presentation/search/controller";
import { SessionAuthGuard } from "../presentation/common/auth/session/sessionGuard";
import { RolesGuard } from "../presentation/common/auth/role/guard";
import { APP_FILTER } from "@nestjs/core";
import { AppExceptionFilter } from "../presentation/common/exceptionFilter";
import { ArticleDAGController } from "../presentation/articleDAG/controller";

@Module({
  controllers: [
    ArticleControllerAdmin, ArticleControllerPrivate, ArticleControllerPublic,
    LoginController, SessionController, SessionControllerAdmin,
    UserControllerPublic, UserControllerPrivate, UserControllerAdmin,
    InteractionUserArticleController, ArticleStatisticControllerPublic,
    SearchControllerPublic,
    ArticleDAGController
  ],
  providers: [
    SessionAuthGuard, 
    RolesGuard,
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter
    }
  ],
})
export class PresentationModule {}
