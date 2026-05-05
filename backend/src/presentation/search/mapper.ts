import { ArticleFilters, ArticleSearchResult } from "../../domain/search/entity";
import { ArticleSearchResultDto, ArticleQueryDto } from "./DTO";

import { ArticleSearchQuery, Limit, Offset } from '../../domain/search/entity';
import { QueryTextValidator } from '../../domain/search/props/query';
import { ArticleIdValidator } from "../../domain/article/props/articleId";
import { UserIdValidator } from "../../domain/user/props/userId";

export const searchResultMapper = (result: ArticleSearchResult): ArticleSearchResultDto => ({
  id: result.id,
  title: result.title,
  contentSnippet: result.contentSnippet,
  authorId: result.authorId,
  relevanceScore: result.relevanceScore,
});


export const toArticleQuery = async (
  dto: ArticleQueryDto,
  queryValidator: QueryTextValidator,
  articleIdValidator: ArticleIdValidator,
  userIdValidator: UserIdValidator
): Promise<ArticleSearchQuery> => {
  const queryText = await queryValidator.validate(dto.query);
  const offset = new Offset((dto.page - 1) * dto.size);
  const limit = new Limit(dto.size);
  const articleIds = dto.articleIds && await Promise.all(
    dto.articleIds.map(async (id) => {
      return await articleIdValidator.validate(id);
    })
  );
  const authorIds = dto.authorIds && await Promise.all(
    dto.authorIds.map(async (id) => {
      return await userIdValidator.validate(id);
    })
  )
  const filters = new ArticleFilters()
  articleIds && (filters.articleIds = articleIds);
  authorIds && (filters.authorIds = authorIds);
  const query = new ArticleSearchQuery(queryText, limit, offset, filters);
  return query
};


