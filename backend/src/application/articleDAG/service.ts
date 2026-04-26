import { Inject, Injectable } from "@nestjs/common";
import { ArticleDAGRepository } from "../../domain/articleDAG/repository";
import { ARTICLE_DAG_REPOSITORY_TOKEN } from "../../tokens";
import { ArticleDAG, ArticleIdsUnique } from "../../domain/articleDAG/entity";

export interface IArticleDAGService {
    getDAG(articleIds: ArticleIdsUnique): Promise<ArticleDAG>
}
@Injectable()
export class ArticleDAGService implements IArticleDAGService {
    constructor(
        @Inject(ARTICLE_DAG_REPOSITORY_TOKEN) private readonly dagRepository: ArticleDAGRepository
    ) {}
    async getDAG(articleIds: ArticleIdsUnique): Promise<ArticleDAG> {
        return await this.dagRepository.getDAG(articleIds);
    }
}