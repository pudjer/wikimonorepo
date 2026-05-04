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
import { GetByIdsDto, ArticlePreviewResultDTO, ArticlePreviewCollectionResultDTO, OrderDto } from "./DTO";
import { resultMapper, collectionResultMapper } from "./mapper";
import { ARTICLE_ID_VALIDATOR_TOKEN, ARTICLE_PREVIEW_SERVICE_TOKEN } from "../../tokens";
import { IArticlePreviewService } from "../../application/articleTotalStatistic/service";
import { PreviewOrder, PreviewOrderingProp } from "../../domain/articlePreview/entity";

@ApiTags('public/articlePreview')
@Controller('public/articlePreview')
export class ArticlePreviewControllerPublic {
    constructor(
        @Inject(ARTICLE_PREVIEW_SERVICE_TOKEN)
        private readonly articlePreviewService: IArticlePreviewService,
        @Inject(ARTICLE_ID_VALIDATOR_TOKEN)
        private readonly articleIdValidator: ArticleIdValidator,
    ) {}

    @ApiOperation({ summary: 'Get article preview by ID' })
    @ApiParam({ name: 'id', description: 'Article ID' })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadArticleIdError)' })
    @ApiNotFoundResponse({ description: 'Preview not found' })
    @ApiResponse({ status: 200, description: 'Preview found', type: ArticlePreviewResultDTO })
    @Get('stats/:id')
    async findById(@Param('id') id: string): Promise<ArticlePreviewResultDTO> {
        const articleId = await this.articleIdValidator.validate(id);
        const stat = await this.articlePreviewService.getByArticleId(articleId);
        return resultMapper(stat);
    }

    @ApiOperation({ summary: 'Get article previews by IDs' })
    @ApiBody({ type: GetByIdsDto })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadArticleIdError)' })
    @ApiResponse({ status: 200, description: 'Previews found', type: ArticlePreviewCollectionResultDTO })
    @Post('by-ids')
    async findByIds(@Body() dto: GetByIdsDto): Promise<ArticlePreviewCollectionResultDTO> {
        const articleIds = await Promise.all(dto.ids.map(id => this.articleIdValidator.validate(id)));
        const stats = await this.articlePreviewService.getByArticleIds(articleIds);
        return collectionResultMapper(stats);
    }

    @Get('order')
    @ApiOperation({ summary: 'Get article previews ordered by prop' })
    @ApiBadRequestResponse({ description: 'Invalid order prop or direction' })
    @ApiResponse({ status: 200, description: 'Ordered previews', type: ArticlePreviewCollectionResultDTO })
    @ApiQuery({ name: 'order', enum: PreviewOrder })
    @ApiQuery({ name: 'orderingProp', enum: PreviewOrderingProp })
    async getInOrder(
      @Query() dto: OrderDto,
    ): Promise<ArticlePreviewCollectionResultDTO> {
      const stats = await this.articlePreviewService.getInOrder(
        dto.orderingProp,
        dto.order,
      );
      return collectionResultMapper(stats);
    }
}
