import { Injectable, Inject } from "@nestjs/common";
import { ArticleId } from "../../../domain/article/props/articleId";
import { UserId } from "../../../domain/user/props/userId";
import { TotalInteractionRepository } from "../../../domain/interactionUserArticle/total/repository";
import { TotalInteraction } from "../../../domain/interactionUserArticle/total/entity";
import { LIKE_REPOSITORY_TOKEN, TOTAL_INTERACTION_REPOSITORY_TOKEN } from "../../../tokens";

export interface ITotalInteractionService {
    get(articleId: ArticleId, userId: UserId): Promise<TotalInteraction>
    getAll(userId: UserId): Promise<TotalInteraction[]>
}
@Injectable()
export class TotalInteractionService implements ITotalInteractionService {
    constructor(
        @Inject(TOTAL_INTERACTION_REPOSITORY_TOKEN) private readonly totalInteractionRepository: TotalInteractionRepository
    ){}
    async get(articleId: ArticleId, userId: UserId): Promise<TotalInteraction> {
        return await this.totalInteractionRepository.find(articleId, userId);
    }

    async getAll(userId: UserId): Promise<TotalInteraction[]> {
        return await this.totalInteractionRepository.findAllByUser(userId);
    }
}