import { Injectable, Inject } from "@nestjs/common";
import { ArticleType } from "../../../domain/article/entity";
import { ArticleId } from "../../../domain/article/props/articleId";
import { ArticleRepository } from "../../../domain/article/repository";
import { UserId } from "../../../domain/user/props/userId";
import { ARTICLE_REPOSITORY_TOKEN } from "../../../tokens";

export interface IArticleServicePublic {
    findById(id: ArticleId): Promise<ArticleType>;
    findByAuthorId(id: UserId): Promise<ArticleId[]>;
}

@Injectable()
export class ArticleServicePublic implements IArticleServicePublic {
    
    constructor(
        @Inject(ARTICLE_REPOSITORY_TOKEN) private readonly articleRepository: ArticleRepository,
    ) {}

    async findById(id: ArticleId): Promise<ArticleType> {
        return await this.articleRepository.findById(id);
    }
    async findByAuthorId(id: UserId): Promise<ArticleId[]> {
        return await this.articleRepository.findByAuthorId(id);
    }
}