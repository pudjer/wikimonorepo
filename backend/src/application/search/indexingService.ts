import { Injectable, Inject } from '@nestjs/common';
import { ArticleType } from "../../domain/article/entity";
import { ArticleSearchRepository } from "../../domain/search/repository";
import { ARTICLE_SEARCH_REPOSITORY_TOKEN } from '../../tokens';
import { ArticleId } from '../../domain/article/props/articleId';

export interface IArticleSearchIndexService {
  indexArticle(article: ArticleType): Promise<true>
  removeArticleFromIndex(articleId: string): Promise<true>
}

@Injectable()
export class ArticleSearchIndexService implements IArticleSearchIndexService {
  constructor(
    @Inject(ARTICLE_SEARCH_REPOSITORY_TOKEN) private readonly searchRepo: ArticleSearchRepository
  ) {}
  
  async indexArticle(article: ArticleType): Promise<true> {
    await this.searchRepo.index(article);
    return true
  }
  
  async removeArticleFromIndex(articleId: ArticleId): Promise<true> {
    await this.searchRepo.removeFromIndex(articleId);
    return true
  }
}