import { ArticleId } from "../../../domain/article/props/articleId";
import { UserId } from "../../../domain/user/props/userId";
import { Timestamp, View } from "../../../domain/interactionUserArticle/view/entity";
import { ViewRepository } from "../../../domain/interactionUserArticle/view/repository";
import { Inject, Injectable } from "@nestjs/common";
import { VIEW_REPOSITORY_TOKEN } from "../../../tokens";


export interface IViewService{
    viewArticle(articleId: ArticleId, userId: UserId): Promise<View>
    removeView(articleId: ArticleId, userId: UserId): Promise<true>
    getByUserId(userId: UserId): Promise<View[]>
}
@Injectable()
export class ViewService implements IViewService{
    constructor(
        @Inject(VIEW_REPOSITORY_TOKEN) private readonly viewRepository: ViewRepository
    ){}
    async viewArticle(articleId: ArticleId, userId: UserId): Promise<View> {
        const view = View.createNew(articleId, userId)
        return await this.viewRepository.create(view)
    }
    async removeView(articleId: ArticleId, userId: UserId): Promise<true> {
        return await this.viewRepository.delete(articleId, userId)
    }
    async getByUserId(userId: UserId): Promise<View[]> {
        return await this.viewRepository.findByUserId(userId)
    }
}