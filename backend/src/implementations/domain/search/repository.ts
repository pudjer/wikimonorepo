import { Injectable, Inject } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { SEARCH_ELASTICSEARCH_CLIENT_TOKEN } from '../../../tokens';
import { ArticleSearchRepository } from '../../../domain/search/repository';
import {
  ArticleSearchQuery,
  ArticleSearchResult,
  ContentSnippet,
  RelevanceScore,
} from '../../../domain/search/entity';
import { ArticleType } from '../../../domain/article/entity';
import { ArticleId } from '../../../domain/article/props/articleId';
import { Title } from '../../../domain/article/props/title';
import { Content } from '../../../domain/article/props/content';
import { UserId } from '../../../domain/user/props/userId';

type ArticleDocument = {
  id: ArticleId;
  title: Title;
  content: Content;
  authorId: UserId;
};

@Injectable()
export class ArticleSearchRepositoryImpl implements ArticleSearchRepository {
  constructor(
    @Inject(SEARCH_ELASTICSEARCH_CLIENT_TOKEN)
    private readonly esClient: Client,
  ) {}

  async onModuleInit() {
    const exists = await this.esClient.indices.exists({
      index: 'articles',
    });
  
    if (!exists) {
      await this.esClient.indices.create({
        index: 'articles',
        mappings: {
          properties: {
            id: { type: 'keyword' },
            title: { type: 'text' },
            content: { type: 'text' },
            authorId: { type: 'keyword' },
          },
        },
      });
    }
  }

  // ---------------------------
  // PUBLIC API
  // ---------------------------

  async search(query: ArticleSearchQuery): Promise<ArticleSearchResult[]> {
    return this.executeSearch({
      queryText: query.queryText,
      from: query.offset.value,
      size: query.limit.value,
      query: this.buildTextQuery(query.queryText),
    });
  }

  async searchIn(
    query: ArticleSearchQuery,
    articleIds: ArticleId[],
  ): Promise<ArticleSearchResult[]> {
    return this.executeSearch({
      queryText: query.queryText,
      from: query.offset.value,
      size: query.limit.value,
      query: {
        bool: {
          must: this.buildTextQuery(query.queryText),
          filter: {
            terms: { id: articleIds },
          },
        },
      },
    });
  }

  async index(article: ArticleType): Promise<true> {
    await this.esClient.index<ArticleDocument>({
      index: 'articles',
      id: article.id,
      document: {
        id: article.id,
        title: article.title,
        content: article.content,
        authorId: article.authorId,
      },
    });

    return true;
  }

  async removeFromIndex(articleId: string): Promise<true> {
    await this.esClient.delete({
      index: 'articles',
      id: articleId,
    });

    return true;
  }

  // ---------------------------
  // CORE SEARCH ENGINE
  // ---------------------------

  private async executeSearch(params: {
    query: any;
    from: number;
    size: number;
    queryText: string;
  }): Promise<ArticleSearchResult[]> {
    const response = await this.esClient.search<ArticleDocument>({
      index: 'articles',
      query: params.query,
      from: params.from,
      size: params.size,
      sort: [{ _score: { order: 'desc' } }],
      highlight: {
        fields: {
          content: { fragment_size: 150 },
        },
      },
    });

    return response.hits.hits
      .map(ElasticArticleMapper.fromHit)
      .filter((x): x is ArticleSearchResult => x !== null);
  }

  // ---------------------------
  // QUERY BUILDER
  // ---------------------------

  private buildTextQuery(queryText: string) {
    return {
      multi_match: {
        query: queryText,
        fields: ['title^2', 'content'],
        type: 'best_fields',
        operator: 'or',
        minimum_should_match: '75%',
      },
    };
  }
}

// ---------------------------
// MAPPER (isolated & testable)
// ---------------------------

export class ElasticArticleMapper {
  static fromHit(hit: any): ArticleSearchResult | null {
    if (!hit?._source) return null;

    const doc: ArticleDocument = hit._source;

    const snippet =
      hit.highlight?.content?.[0] ??
      doc.content.slice(0, 150);

    return new ArticleSearchResult(
      doc.id,
      doc.title,
      snippet as ContentSnippet,
      doc.authorId,
      (hit._score ?? 0) as RelevanceScore,
    );
  }
}