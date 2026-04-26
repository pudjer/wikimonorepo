import { Injectable, Inject } from "@nestjs/common";
import { ArticleId } from "../../../domain/article/props/articleId";
import { Like } from "../../../domain/interactionUserArticle/like/entity";
import { LikeRepository } from "../../../domain/interactionUserArticle/like/repository";
import { UserId } from "../../../domain/user/props/userId";
import { LIKE_REPOSITORY_TOKEN } from "../../../tokens";

export interface ILikeService{
    likeArticle(articleId: ArticleId, userId: UserId): Promise<Like>
    removeLike(articleId: ArticleId, userId: UserId): Promise<true>
}
@Injectable()
export class LikeService implements ILikeService{
    constructor(
        @Inject(LIKE_REPOSITORY_TOKEN) private readonly likeRepository: LikeRepository
    ){}
    async likeArticle(articleId: ArticleId, userId: UserId): Promise<Like> {
        const like = Like.createNew(articleId, userId)
        return await this.likeRepository.create(like)
    }
    async removeLike(articleId: ArticleId, userId: UserId): Promise<true> {
        return await this.likeRepository.delete(articleId, userId)
    }
    async getLikes(userId: UserId): Promise<Like[]> {
        return await this.likeRepository.findByUserId(userId)
    }
}