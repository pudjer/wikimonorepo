import { Controller, Inject, Post, Body, Param, Delete, Patch, Get, Query } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ArticleIdValidator } from "../../domain/article/props/articleId";
import { UserId, UserIdValidator } from "../../domain/user/props/userId";
import { UserIdParam } from "../common/auth/paramDecorators";
import { InteractionResultDto, LearnProgressDto, LikeDto, UpdateLearnProgressDto, ViewDto } from "./DTO";
import { ARTICLE_ID_VALIDATOR_TOKEN, LEARN_PROGRESS_SERVICE_TOKEN, LIKE_SERVICE_TOKEN, TOTAL_INTERACTION_SERVICE_TOKEN, USER_ID_VALIDATOR_TOKEN, VIEW_SERVICE_TOKEN } from "../../tokens";
import { ILearnProgressService } from "../../application/interactionUserArticle/learnProgress/service";
import { ILikeService } from "../../application/interactionUserArticle/like/service";
import { IViewService } from "../../application/interactionUserArticle/view/service";
import { RoleAuth } from "../common/auth/role/roleDecorator";
import { BaseRole } from "../../domain/user/roles";
import { Success } from "../common/DTO";
import { ITotalInteractionService } from "../../application/interactionUserArticle/total/service";

@ApiTags('private/interactionUserArticle')
@Controller('private/interactionUserArticle')
@RoleAuth([BaseRole])
export class InteractionUserArticleController {
  constructor(
    @Inject(LEARN_PROGRESS_SERVICE_TOKEN)
    private readonly learnProgressService: ILearnProgressService,

    @Inject(LIKE_SERVICE_TOKEN)
    private readonly likeService: ILikeService,

    @Inject(VIEW_SERVICE_TOKEN)
    private readonly viewService: IViewService,

    @Inject(ARTICLE_ID_VALIDATOR_TOKEN)
    private readonly articleIdValidator: ArticleIdValidator,

    @Inject(TOTAL_INTERACTION_SERVICE_TOKEN)
    private readonly totalService: ITotalInteractionService,

    @Inject(USER_ID_VALIDATOR_TOKEN)
    private readonly userIdValidator: UserIdValidator,
  ) {}

  @ApiOperation({ summary: 'Update learn progress stage' })
  @ApiParam({ name: 'articleId', description: 'Article ID' })
  @ApiBody({ type: UpdateLearnProgressDto })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiResponse({ status: 200, type: Success })
  @Post('articles/:articleId/learnProgress')
  async updateLearnProgress(
    @Param('articleId') articleIdStr: string,
    @Body() dto: UpdateLearnProgressDto,
    @UserIdParam() userId: UserId,
  ): Promise<Success> {
    const articleId = await this.articleIdValidator.validate(articleIdStr);
    await this.learnProgressService.update(dto.stage, articleId, userId);
    return new Success();
  }

  @ApiOperation({ summary: 'Like article' })
  @ApiParam({ name: 'articleId', description: 'Article ID' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiResponse({ status: 201, type: Success })
  @Post('articles/:articleId/like')
  async like(
    @Param('articleId') articleIdStr: string,
    @UserIdParam() userId: UserId,
  ): Promise<Success> {
    const articleId = await this.articleIdValidator.validate(articleIdStr);
    await this.likeService.likeArticle(articleId, userId);
    return new Success();
  }

  @ApiOperation({ summary: 'Unlike article' })
  @ApiParam({ name: 'articleId', description: 'Article ID' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiResponse({ status: 200, type: Success })
  @Delete('articles/:articleId/like')
  async unlike(
    @Param('articleId') articleIdStr: string,
    @UserIdParam() userId: UserId,
  ): Promise<Success> {
    const articleId = await this.articleIdValidator.validate(articleIdStr);
    await this.likeService.removeLike(articleId, userId);
    return new Success();
  }

  @ApiOperation({ summary: 'View article' })
  @ApiParam({ name: 'articleId', description: 'Article ID' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiResponse({ status: 201, type: Success })
  @Post('articles/:articleId/view')
  async view(
    @Param('articleId') articleIdStr: string,
    @UserIdParam() userId: UserId,
  ): Promise<Success> {
    const articleId = await this.articleIdValidator.validate(articleIdStr);
    await this.viewService.viewArticle(articleId, userId);
    return new Success();
  }

  @ApiOperation({ summary: 'Remove view' })
  @ApiParam({ name: 'articleId', description: 'Article ID' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiResponse({ status: 200, type: Success })
  @Delete('articles/:articleId/view')
  async removeView(
    @Param('articleId') articleIdStr: string,
    @UserIdParam() userId: UserId,
  ): Promise<Success> {
    const articleId = await this.articleIdValidator.validate(articleIdStr);
    await this.viewService.removeView(articleId, userId);
    return new Success();
  }


  @ApiOperation({ summary: 'Get user-article interaction total stats' })
  @ApiParam({ name: 'articleId', description: 'Article ID' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiResponse({ status: 200, type: InteractionResultDto })
  @Get('articles/:articleId/total')
  async getTotal(@Param('articleId') articleIdStr: string, @UserIdParam('userId') userIdStr: string): Promise<InteractionResultDto> {
    const articleId = await this.articleIdValidator.validate(articleIdStr);
    const userId = await this.userIdValidator.validate(userIdStr);
    const total = await this.totalService.get(articleId, userId);
    return {
      userId: total.userId,
      articleId: total.articleId,
      isLiked: total.isLiked,
      isViewed: total.isViewed,
      learnProgressStage: total.learnProgressStage,
      lastInteraction: total.lastInteraction ? total.lastInteraction.toISOString() : null,
    };
  }

  @ApiOperation({ summary: 'Get user-article interaction total stats for all interacted articles' })
  @ApiResponse({ status: 200, type: [InteractionResultDto] })
  @Get('total')
  async getTotalAll(@UserIdParam() userId: UserId): Promise<InteractionResultDto[]> {
    const totals = await this.totalService.getAll(userId);
    return totals.map(total => ({
      userId: total.userId,
      articleId: total.articleId,
      isLiked: total.isLiked,
      isViewed: total.isViewed,
      learnProgressStage: total.learnProgressStage,
      lastInteraction: total.lastInteraction ? total.lastInteraction.toISOString() : null,
    }));
  }

  @ApiOperation({ summary: 'Get all likes by user' })
  @ApiResponse({ status: 200, type: [LikeDto] })
  @Get('likes')
  async getLikes(@UserIdParam() userId: UserId): Promise<LikeDto[]> {
    const likes = await this.likeService.getByUserId(userId);
    return likes.map(like => ({
      articleId: like.articleId as string,
      userId: like.userId as string,
      timestamp: like.timestamp.toISOString(),
    }));
  }

  @ApiOperation({ summary: 'Get all views by user' })
  @ApiResponse({ status: 200, type: [ViewDto] })
  @Get('views')
  async getViews(@UserIdParam() userId: UserId): Promise<ViewDto[]> {
    const views = await this.viewService.getByUserId(userId);
    return views.map(view => ({
      articleId: view.articleId as string,
      userId: view.userId as string,
      timestamp: view.timestamp.toISOString(),
    }));
  }

  @ApiOperation({ summary: 'Get all learn progress by user' })
  @ApiResponse({ status: 200, type: [LearnProgressDto] })
  @Get('learnProgress')
  async getLearnProgress(@UserIdParam() userId: UserId): Promise<LearnProgressDto[]> {
    const progresses = await this.learnProgressService.getByUserId(userId);
    return progresses.map(progress => ({
      articleId: progress.articleId as string,
      userId: progress.userId as string,
      learnProgressStage: progress.learnProgressStage,
      updatedAt: progress.updatedAt.toISOString(),
    }));
  }
}

