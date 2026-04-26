import { Controller, Inject, Get, Query, ValidationPipe } from "@nestjs/common";
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
import { ARTICLE_ID_VALIDATOR_TOKEN, ARTICLE_SEARCH_SERVICE_TOKEN, QUERY_VALIDATOR_TOKEN } from "../../tokens";
import { SearchArticlesQueryDto, SearchInArticlesQueryDto, SearchArticlesResultDto } from "./DTO";
import { searchResultMapper, toArticleSearchQuery, toSearchInArticlesQuery } from "./mapper";
import { ArticleIdValidator } from "../../domain/article/props/articleId";

@ApiTags('public/search')
@Controller('public/search')
export class SearchControllerPublic {
    constructor(
        @Inject(ARTICLE_SEARCH_SERVICE_TOKEN)
        private readonly searchService: IArticleSearchService,

        @Inject(QUERY_VALIDATOR_TOKEN)
        private readonly queryValidator: QueryTextValidator,

        @Inject(ARTICLE_ID_VALIDATOR_TOKEN)
        private readonly articleIdValidator: ArticleIdValidator
    ) {}

    @ApiOperation({ summary: 'Search articles by query text' })
    @ApiQuery({ name: 'query', description: 'Search query text', type: String, required: true })
    @ApiQuery({ name: 'page', description: 'Page number (default 1)', type: Number, required: false })
    @ApiQuery({ name: 'size', description: 'Page size (default 10, max 100)', type: Number, required: false })
    @ApiBadRequestResponse({ description: 'Invalid input (bad query or pagination)' })
    @ApiResponse({ status: 200, description: 'Search results', type: SearchArticlesResultDto })
    @Get('articles')
    async searchArticles(@Query(ValidationPipe) dto: SearchArticlesQueryDto): Promise<SearchArticlesResultDto> {
        const searchQuery = await toArticleSearchQuery(dto, this.queryValidator);
        const results = await this.searchService.searchArticles(searchQuery);
        return {
            results: results.map(searchResultMapper),
        };
    }

    @ApiOperation({ summary: 'Search articles by query text within specific article IDs' })
    @ApiQuery({ name: 'query', description: 'Search query text', type: String, required: true })
    @ApiQuery({ name: 'articleIds', description: 'Article IDs', isArray: true, type: String })
    @ApiQuery({ name: 'page', description: 'Page number (default 1)', type: Number, required: false })
    @ApiQuery({ name: 'size', description: 'Page size (default 10, max 100)', type: Number, required: false })
    @ApiBadRequestResponse({ description: 'Invalid input (bad query, articleIds or pagination)' })
    @ApiResponse({ status: 200, description: 'Scoped search results', type: SearchArticlesResultDto })
    @Get('in-articles')
    async searchInArticles(@Query(ValidationPipe) dto: SearchInArticlesQueryDto): Promise<SearchArticlesResultDto> {
        const { query: searchQuery, articleIds } = await toSearchInArticlesQuery(dto, this.queryValidator, this.articleIdValidator);
        const results = await this.searchService.searchInArticles(searchQuery, articleIds);
        return {
            results: results.map(searchResultMapper),
        };
    }
}
