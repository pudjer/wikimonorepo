import { Controller, Inject, Body, Param, Patch, Delete } from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiConflictResponse,
    ApiResponse,
    ApiBody,
    ApiParam,
} from '@nestjs/swagger';
import { ArticleIdValidator } from "../../../domain/article/props/articleId";
import { ContentValidator } from "../../../domain/article/props/content";
import { TitleValidator } from "../../../domain/article/props/title";
import { ArticleReferencesValidator } from "../../../domain/article/references";
import { UpdateArticleDto, ArticleResultDTO } from "../common/DTO";
import { resultMapper } from "../common/mapper";
import { Success } from "../../common/DTO";
import { ARTICLE_ID_VALIDATOR_TOKEN, ARTICLE_REFERENCES_VALIDATOR, ARTICLE_SERVICE_ADMIN_TOKEN, ARTICLE_SERVICE_PRIVATE_TOKEN, CONTENT_VALIDATOR_TOKEN, TITLE_VALIDATOR_TOKEN } from "../../../tokens";
import { UpdateArticleInputPrivate } from "../../../application/article/private/DTO";
import { RoleAuth } from "../../common/auth/role/roleDecorator";
import { AdminRole } from "../../../domain/user/roles";
import { IArticleServiceAdmin } from "../../../application/article/admin/service";

  
@RoleAuth([AdminRole])
@ApiTags('admin/articles')
@Controller('admin/articles')
export class ArticleControllerAdmin {
    constructor(
        @Inject(ARTICLE_SERVICE_ADMIN_TOKEN)
        private readonly articleService: IArticleServiceAdmin,

        @Inject(TITLE_VALIDATOR_TOKEN)
        private readonly titleValidator: TitleValidator,

        @Inject(CONTENT_VALIDATOR_TOKEN)
        private readonly contentValidator: ContentValidator,

        @Inject(ARTICLE_ID_VALIDATOR_TOKEN)
        private readonly articleIdValidator: ArticleIdValidator,

        @Inject(ARTICLE_REFERENCES_VALIDATOR)
        private readonly referencesValidator: ArticleReferencesValidator,

    ) {}


    @ApiOperation({ summary: 'Update existing article' })
    @ApiParam({ name: 'id', description: 'Article ID' })
    @ApiBody({ type: UpdateArticleDto })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadArticleIdError, BadTitleError)' })
    @ApiNotFoundResponse({ description: 'Article not found (e.g., ArticleNotFoundError)' })
    @ApiConflictResponse({ description: 'Link issues (e.g., ArticleLinksCycleError)' })
    @ApiResponse({ status: 200, description: 'Article updated', type: ArticleResultDTO })
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateArticleDto,
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

        const article = await this.articleService.updateByAdmin(input, articleId);
        return resultMapper(article);
    }

    @ApiOperation({ summary: 'Delete existing article' })
    @ApiParam({ name: 'id', description: 'Article ID' })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadArticleIdError)' })
    @ApiNotFoundResponse({ description: 'Article not found (e.g., ArticleNotFoundError)' })
    @ApiResponse({ status: 200, description: 'Article deleted', type: Success })
    @Delete(':id')
    async delete(
        @Param('id') id: string,
    ): Promise<Success> {
        const articleId = await this.articleIdValidator.validate(id);
        await this.articleService.deleteByAdmin(articleId);
        return new Success();
    }
}
