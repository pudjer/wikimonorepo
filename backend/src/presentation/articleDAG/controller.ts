import { Controller, Inject, Post, Body, BadRequestException, NotFoundException, Get, Query } from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiResponse, 
    ApiBody,
    ApiQuery
} from '@nestjs/swagger';
import { ArticleId } from "../../domain/article/props/articleId";
import { ArticleIdValidator } from "../../domain/article/props/articleId";
import { ArticleIdsUnique } from "../../domain/articleDAG/entity";
import { GetArticleDAGQueryDto, ArticleDAGResultDTO } from "./DTO";
import { resultMapper } from "./mapper";
import { ARTICLE_DAG_SERVICE_TOKEN, ARTICLE_ID_VALIDATOR_TOKEN } from "../../tokens";
import { IArticleDAGService } from "../../application/articleDAG/service";

@ApiTags('public/articleDAG')
@Controller('public/articleDAG')
export class ArticleDAGController {
    constructor(
        @Inject(ARTICLE_DAG_SERVICE_TOKEN)
        private readonly articleDAGService: IArticleDAGService,
        @Inject(ARTICLE_ID_VALIDATOR_TOKEN)
        private readonly articleIdValidator: ArticleIdValidator,
    ) {}

    @ApiOperation({ summary: 'Get Article DAG by Article IDs' })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadArticleIdError)' })
    @ApiNotFoundResponse({ description: 'DAG not found or empty' })
    @ApiResponse({ status: 200, description: 'DAG found', type: ArticleDAGResultDTO })
    @Post()
    async getDAG(
        @Body() dto: GetArticleDAGQueryDto,
    ): Promise<ArticleDAGResultDTO> {
        const articleIds: ArticleId[] = await Promise.all(
            dto.ids.map(id => this.articleIdValidator.validate(id))
        );
    
        const articleIdsUnique: ArticleIdsUnique = new Set(articleIds);
        const dag = await this.articleDAGService.getDAG(articleIdsUnique);
    
        return resultMapper(dag);
    }
}

