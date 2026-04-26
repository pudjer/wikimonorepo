import { Inject, Injectable } from "@nestjs/common";
import { ArticleId } from "../../domain/article/props/articleId";
import { ArticleStatistic, Order, OrderingProp } from "../../domain/articleStatistic/entity";
import { ArticleStatisticRepository } from "../../domain/articleStatistic/repository";
import { ARTICLE_STATISTIC_REPOSITORY_TOKEN } from "../../tokens";

export interface IArticleStatisticService {
    getByArticleId(aId: ArticleId): Promise<ArticleStatistic>
    getByArticleIds(aIds: ArticleId[]): Promise<ArticleStatistic[]>
    getInOrder(orderBy: OrderingProp, order: Order): Promise<ArticleStatistic[]>
}
@Injectable()
export class ArticleStatisticService implements IArticleStatisticService {
    constructor(
        @Inject(ARTICLE_STATISTIC_REPOSITORY_TOKEN) private readonly articleStatisticRepository: ArticleStatisticRepository
    ){}
    async getByArticleId(aId: ArticleId): Promise<ArticleStatistic> {
        return await this.articleStatisticRepository.findById(aId)
    }
    async getByArticleIds(aIds: ArticleId[]): Promise<ArticleStatistic[]> {
        return await this.articleStatisticRepository.findByIds(aIds)
    }
    async getInOrder(orderBy: OrderingProp, order: Order): Promise<ArticleStatistic[]> {
        return await this.articleStatisticRepository.getInOrder(orderBy, order)
    }
}