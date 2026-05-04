import { Controller, Inject, Get, Param } from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiResponse, 
    ApiParam
} from '@nestjs/swagger';
import { ArticleIdValidator } from "../../../domain/article/props/articleId";
import { UserIdValidator } from "../../../domain/user/props/userId";
import { ArticleResultDTO, ArticleIdCollectionResultDTO } from "../common/DTO";
import { resultMapper } from "../common/mapper";
import { ARTICLE_ID_VALIDATOR_TOKEN, ARTICLE_SERVICE_PUBLIC_TOKEN, USER_ID_VALIDATOR_TOKEN } from "../../../tokens";
import { IArticleServicePublic } from "../../../application/article/public/service";

  
  
@ApiTags('public/articles')
@Controller('public/articles')
export class ArticleControllerPublic {
    constructor(
        @Inject(ARTICLE_SERVICE_PUBLIC_TOKEN)
        private readonly articleService: IArticleServicePublic,

        @Inject(ARTICLE_ID_VALIDATOR_TOKEN)
        private readonly articleIdValidator: ArticleIdValidator,

        @Inject(USER_ID_VALIDATOR_TOKEN)
        private readonly userIdValidator: UserIdValidator,

    ) {}

    @ApiOperation({ summary: 'Get article by ID' })
    @ApiParam({ name: 'id', description: 'Article ID' })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadArticleIdError)' })
    @ApiNotFoundResponse({ description: 'Article not found (e.g., ArticleNotFoundError)' })
    @ApiResponse({ status: 200, description: 'Article found', type: ArticleResultDTO })
    @Get('article/:id')
    async findById(@Param('id') id: string): Promise<ArticleResultDTO> {
        const articleId = await this.articleIdValidator.validate(id);
        const article = await this.articleService.findById(articleId);
        return resultMapper(article);
    }

    @ApiOperation({ summary: 'Get article IDs by author ID' })
    @ApiParam({ name: 'id', description: 'User ID' })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadUserIdError)' })
    @ApiNotFoundResponse({ description: 'Author not found (e.g., AuthorNotFoundError)' })
    @ApiResponse({ status: 200, description: 'Article IDs found', type: ArticleIdCollectionResultDTO })
    @Get('author/:id')
    async findByAuthorId(@Param('id') id: string): Promise<ArticleIdCollectionResultDTO> {
        const userId = await this.userIdValidator.validate(id);
        const articleIds = await this.articleService.findByAuthorId(userId);
        return { ids: articleIds };
    }

}

