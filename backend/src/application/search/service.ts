import { Injectable, Inject } from '@nestjs/common';
import { ArticleSearchQuery, ArticleSearchResult, Limit, Offset } from "../../domain/search/entity";
import { ArticleSearchRepository } from "../../domain/search/repository";
import { ARTICLE_SEARCH_REPOSITORY_TOKEN } from '../../tokens';
import { ArticleId } from '../../domain/article/props/articleId';

export interface IArticleSearchService {
  searchArticles(query: ArticleSearchQuery): Promise<ArticleSearchResult[]>
  searchInArticles(query: ArticleSearchQuery, articleIds: ArticleId[]): Promise<ArticleSearchResult[]>
}

@Injectable()
export class ArticleSearchService implements IArticleSearchService {
  constructor(
    @Inject(ARTICLE_SEARCH_REPOSITORY_TOKEN) private readonly searchRepo: ArticleSearchRepository
  ) {}

  async searchArticles(query: ArticleSearchQuery): Promise<ArticleSearchResult[]> {
    return this.searchRepo.search(query);
  }

  async searchInArticles(query: ArticleSearchQuery, articleIds: ArticleId[]): Promise<ArticleSearchResult[]> {
    return this.searchRepo.searchIn(query, articleIds);
  }
}