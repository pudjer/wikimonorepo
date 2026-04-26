import { Controller, Inject, Post, Body, Param, Patch, Delete } from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiForbiddenResponse,
    ApiConflictResponse,
    ApiResponse,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';
import { ArticleIdValidator } from "../../../domain/article/props/articleId";
import { ContentValidator } from "../../../domain/article/props/content";
import { TitleValidator } from "../../../domain/article/props/title";
import { ArticleReferencesValidator } from "../../../domain/article/references";
import { UserId } from "../../../domain/user/props/userId";
import { UserIdParam } from "../../common/auth/paramDecorators";
import { CreateArticleDto, UpdateArticleDto, ArticleResultDTO } from "../common/DTO";
import { resultMapper } from "../common/mapper";
import { Success } from "../../common/DTO";
import { IArticleServicePrivate } from "../../../application/article/private/service";
import { ARTICLE_ID_VALIDATOR_TOKEN, ARTICLE_REFERENCES_VALIDATOR, ARTICLE_SERVICE_PRIVATE_TOKEN, CONTENT_VALIDATOR_TOKEN, TITLE_VALIDATOR_TOKEN } from "../../../tokens";
import { CreateArticleInputPrivate, UpdateArticleInputPrivate } from "../../../application/article/private/DTO";
import { RoleAuth } from "../../common/auth/role/roleDecorator";
import { BaseRole } from "../../../domain/user/roles";

  
@RoleAuth([BaseRole])
@ApiTags('private/articles')
@Controller('private/articles')
export class ArticleControllerPrivate {
    constructor(
        @Inject(ARTICLE_SERVICE_PRIVATE_TOKEN)
        private readonly articleService: IArticleServicePrivate,

        @Inject(TITLE_VALIDATOR_TOKEN)
        private readonly titleValidator: TitleValidator,

        @Inject(CONTENT_VALIDATOR_TOKEN)
        private readonly contentValidator: ContentValidator,

        @Inject(ARTICLE_ID_VALIDATOR_TOKEN)
        private readonly articleIdValidator: ArticleIdValidator,

        @Inject(ARTICLE_REFERENCES_VALIDATOR)
        private readonly referencesValidator: ArticleReferencesValidator,

    ) {}

    @ApiOperation({ summary: 'Create new article' })
    @ApiBody({ type: CreateArticleDto })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadTitleError, BadContentError, BadArticleToArticleLinkNameError)' })
    @ApiForbiddenResponse({ description: 'Access denied (e.g., ArticleAuthorityError)' })
    @ApiConflictResponse({ description: 'Link issues (e.g., ArticleLinksCycleError, ArticleSelfReferenceError)' })
    @ApiResponse({ status: 201, description: 'Article created', type: ArticleResultDTO })
    @Post()
    async create(
        @Body() dto: CreateArticleDto,
        @UserIdParam() userId: UserId,
    ): Promise<ArticleResultDTO> {
        const title = await this.titleValidator.validate(dto.title);
        const content = await this.contentValidator.validate(dto.content);
        const links = await this.referencesValidator.validate(dto.links);

        const input: CreateArticleInputPrivate = {
            title,
            content,
            links,
        };

        const article = await this.articleService.create(input, userId);
        return resultMapper(article);
    }

    @ApiOperation({ summary: 'Update existing article' })
    @ApiParam({ name: 'id', description: 'Article ID' })
    @ApiBody({ type: UpdateArticleDto })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadArticleIdError, BadTitleError, BadContentError)' })
    @ApiNotFoundResponse({ description: 'Article not found (e.g., ArticleNotFoundError)' })
    @ApiForbiddenResponse({ description: 'Access denied (e.g., ArticleAuthorityError)' })
    @ApiConflictResponse({ description: 'Link issues (e.g., ArticleLinksCycleError)' })
    @ApiResponse({ status: 200, description: 'Article updated', type: ArticleResultDTO })
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateArticleDto,
        @UserIdParam() userId: UserId,
    ): Promise<ArticleResultDTO> {
        const articleId = await this.articleIdValidator.validate(id);

        const input: UpdateArticleInputPrivate = {};

        if (dto.title !== undefined) {
            input.title = await this.titleValidator.validate(dto.title);
        }

        if (dto.content !== undefined) {
            input.content = await this.contentValidator.validate(dto.content);
        }

        if (dto.links !== undefined) {
            input.links = await this.referencesValidator.validate(dto.links);
        }

        const article = await this.articleService.update(input, articleId, userId);
        return resultMapper(article);
    }

    @ApiOperation({ summary: 'Delete existing article' })
    @ApiParam({ name: 'id', description: 'Article ID' })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadArticleIdError)' })
    @ApiNotFoundResponse({ description: 'Article not found (e.g., ArticleNotFoundError)' })
    @ApiForbiddenResponse({ description: 'Access denied (e.g., ArticleAuthorityError)' })
    @ApiResponse({ status: 200, description: 'Article deleted', type: Success })
    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @UserIdParam() userId: UserId,
    ): Promise<Success> {
        const articleId = await this.articleIdValidator.validate(id);
        await this.articleService.delete(articleId, userId);
        return new Success();
    }
}
