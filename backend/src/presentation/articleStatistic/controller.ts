import { Controller, Inject, Get, Param, Post, Body, Query } from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiResponse, 
    ApiParam,
    ApiBody,
    ApiQuery
} from '@nestjs/swagger';
import { ArticleIdValidator } from "../../domain/article/props/articleId";
import { GetByIdsDto, ArticleStatisticResultDTO, ArticleStatisticCollectionResultDTO, OrderDto } from "./DTO";
import { resultMapper, collectionResultMapper } from "./mapper";
import { ARTICLE_STATISTIC_SERVICE_TOKEN, ARTICLE_ID_VALIDATOR_TOKEN } from "../../tokens";
import { IArticleStatisticService } from "../../application/articleTotalStatistic/service";
import { Order, OrderingProp } from "../../domain/articleStatistic/entity";

@ApiTags('public/articleStatistic')
@Controller('public/articleStatistic')
export class ArticleStatisticControllerPublic {
    constructor(
        @Inject(ARTICLE_STATISTIC_SERVICE_TOKEN)
        private readonly articleStatisticService: IArticleStatisticService,
        @Inject(ARTICLE_ID_VALIDATOR_TOKEN)
        private readonly articleIdValidator: ArticleIdValidator,
    ) {}

    @ApiOperation({ summary: 'Get article statistic by ID' })
    @ApiParam({ name: 'id', description: 'Article ID' })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadArticleIdError)' })
    @ApiNotFoundResponse({ description: 'Statistic not found' })
    @ApiResponse({ status: 200, description: 'Statistic found', type: ArticleStatisticResultDTO })
    @Get('stats/:id')
    async findById(@Param('id') id: string): Promise<ArticleStatisticResultDTO> {
        const articleId = await this.articleIdValidator.validate(id);
        const stat = await this.articleStatisticService.getByArticleId(articleId);
        return resultMapper(stat);
    }

    @ApiOperation({ summary: 'Get article statistics by IDs' })
    @ApiBody({ type: GetByIdsDto })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadArticleIdError)' })
    @ApiResponse({ status: 200, description: 'Statistics found', type: ArticleStatisticCollectionResultDTO })
    @Post('by-ids')
    async findByIds(@Body() dto: GetByIdsDto): Promise<ArticleStatisticCollectionResultDTO> {
        const articleIds = await Promise.all(dto.ids.map(id => this.articleIdValidator.validate(id)));
        const stats = await this.articleStatisticService.getByArticleIds(articleIds);
        return collectionResultMapper(stats);
    }

    @Get('order')
    @ApiOperation({ summary: 'Get article statistics ordered by prop' })
    @ApiBadRequestResponse({ description: 'Invalid order prop or direction' })
    @ApiResponse({ status: 200, description: 'Ordered statistics', type: ArticleStatisticCollectionResultDTO })
    @ApiQuery({ name: 'order', enum: Order })
    @ApiQuery({ name: 'orderingProp', enum: OrderingProp })
    async getInOrder(
      @Query() dto: OrderDto,
    ): Promise<ArticleStatisticCollectionResultDTO> {
      const stats = await this.articleStatisticService.getInOrder(
        dto.orderingProp,
        dto.order,
      );
      return collectionResultMapper(stats);
    }
}
