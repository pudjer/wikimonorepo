import queryApi, { ArticleQueryDto, ArticleSearchResultDto } from "../../../api/queryApi";

export type SearchOutput = {contentSnippet: string, relevanceScore: number}
export const Search = async (query: ArticleQueryDto): Promise<ArticleSearchResultDto[]> => {
  const searchRes = await queryApi.public.searchArticle(query)
  return searchRes.results
}