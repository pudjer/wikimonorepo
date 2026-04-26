import { Inject, Injectable } from "@nestjs/common";
import { ArticleId } from "../../../domain/article/props/articleId";
import { LearnProgress, LearnProgressStage, UpdatedAt } from "../../../domain/interactionUserArticle/learnProgress/entity";
import { LearnProgressRepository } from "../../../domain/interactionUserArticle/learnProgress/repository";
import { UserId } from "../../../domain/user/props/userId";
import { LEARN_PROGRESS_REPOSITORY_TOKEN } from "../../../tokens";

export interface ILearnProgressService{
    update(stage: LearnProgressStage, articleId: ArticleId, userId: UserId): Promise<LearnProgress>
    getByUserId(userId: UserId): Promise<LearnProgress[]>
}
@Injectable()
export class LearnProgressService implements ILearnProgressService{
    constructor(
        @Inject(LEARN_PROGRESS_REPOSITORY_TOKEN) private readonly learnProgressRepository: LearnProgressRepository
    ){}

    async update(stage: LearnProgressStage, articleId: ArticleId, userId: UserId): Promise<LearnProgress> {
        const learned = LearnProgress.createNew(articleId, userId, stage);
        return this.learnProgressRepository.update(learned);
    }
    
    async getByUserId(userId: UserId): Promise<LearnProgress[]> {
        return this.learnProgressRepository.findByUserId(userId);
    }
}