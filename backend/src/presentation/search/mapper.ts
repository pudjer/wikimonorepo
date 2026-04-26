import { ArticleSearchResult } from "../../domain/search/entity";
import { ArticleSearchResultDto, SearchInArticlesQueryDto } from "./DTO";

import { ArticleSearchQuery, Limit, Offset } from '../../domain/search/entity';
import { QueryTextValidator } from '../../domain/search/props/query';
import { SearchArticlesQueryDto } from './DTO';
import { ArticleId, ArticleIdValidator } from "../../domain/article/props/articleId";

export const searchResultMapper = (result: ArticleSearchResult): ArticleSearchResultDto => ({
  id: result.id,
  title: result.title,
  contentSnippet: result.contentSnippet,
  authorId: result.authorId,
  relevanceScore: result.relevanceScore,
});

export const toArticleSearchQuery = async (
  dto: SearchArticlesQueryDto,
  queryValidator: QueryTextValidator
): Promise<ArticleSearchQuery> => {
  const queryText = await queryValidator.validate(dto.query);
  const offset = new Offset((dto.page - 1) * dto.size);
  const limit = new Limit(dto.size);
  return new ArticleSearchQuery(queryText, limit, offset);
};

export const toSearchInArticlesQuery = async (
  dto: SearchInArticlesQueryDto,
  queryValidator: QueryTextValidator,
  articleIdValidator: ArticleIdValidator
): Promise<{ query: ArticleSearchQuery; articleIds: ArticleId[] }> => {
  const query = await toArticleSearchQuery(dto, queryValidator);
  const articleIds = await Promise.all(
    dto.articleIds.map(async (id) => {
      return await articleIdValidator.validate(id);
    })
  );
  return { query, articleIds };
};


