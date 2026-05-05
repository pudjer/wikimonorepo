import { Controller, Inject, Get, Query, ValidationPipe, Post, Body } from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiQuery,
    ApiBadRequestResponse,
    ApiResponse,
    ApiBody,
} from '@nestjs/swagger';
import { IArticleSearchService } from "../../application/search/service";
import { QueryTextValidator } from "../../domain/search/props/query";
import { ARTICLE_ID_VALIDATOR_TOKEN, ARTICLE_SEARCH_SERVICE_TOKEN, QUERY_VALIDATOR_TOKEN, USER_ID_VALIDATOR_TOKEN } from "../../tokens";
import { ArticleQueryDto, SearchArticlesResultDto } from "./DTO";
import { searchResultMapper, toArticleQuery } from "./mapper";
import { ArticleIdValidator } from "../../domain/article/props/articleId";
import { UserIdValidator } from "../../domain/user/props/userId";

@ApiTags('public/search')
@Controller('public/search')
export class SearchControllerPublic {
    constructor(
        @Inject(ARTICLE_SEARCH_SERVICE_TOKEN)
        private readonly searchService: IArticleSearchService,

        @Inject(QUERY_VALIDATOR_TOKEN)
        private readonly queryValidator: QueryTextValidator,

        @Inject(ARTICLE_ID_VALIDATOR_TOKEN)
        private readonly articleIdValidator: ArticleIdValidator,

        @Inject(USER_ID_VALIDATOR_TOKEN)
        private readonly userIdValidator: UserIdValidator
    ) {}

    @ApiOperation({ summary: 'Search articles by query text' })
    @ApiBadRequestResponse({ description: 'Invalid input (bad query or pagination)' })
    @ApiResponse({ status: 200, description: 'Search results', type: SearchArticlesResultDto })
    @Post('articles')
    async searchArticles(@Body(ValidationPipe) dto: ArticleQueryDto): Promise<SearchArticlesResultDto> {
        const searchQuery = await toArticleQuery(dto, this.queryValidator, this.articleIdValidator, this.userIdValidator);
        const results = await this.searchService.searchArticles(searchQuery);
        return {
            results: results.map(searchResultMapper),
        };
    }

}
