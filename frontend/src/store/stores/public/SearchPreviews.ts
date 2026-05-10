import queryApi, { ArticleQueryDto } from "../../../api/queryApi";
import { arrayToString } from "../../stringArray";
import { ArticlePreview, ArticlePreviewCollectionRule } from "./ArticlePreview";

export type SearchOutput = {contentSnippet: string, relevanceScore: number}
export type SearchRecord = {info: SearchOutput, preview: ArticlePreview}
export const SearchPreviews = async (query: ArticleQueryDto): Promise<SearchRecord[]> => {
  const searchRes = await queryApi.public.searchArticle(query)
  const ids = arrayToString(searchRes.results.map(r => r.id))
  const prevs: ArticlePreview[] = await ArticlePreviewCollectionRule.resolveOutside(ids)
  
  // Создаём Map для быстрого доступа к превью по id
  const previewMap = new Map(prevs.map(p => [p.id, p]))
  
  // Комбинируем результаты поиска с превью
  const searchRecords: SearchRecord[] = searchRes.results.map(result => ({
    info: {
      contentSnippet: result.contentSnippet, // или откуда у вас берётся сниппет
      relevanceScore: result.relevanceScore // зависит от структуры ответа API
    },
    preview: previewMap.get(result.id)!
  })).filter(record => record.preview !== undefined) // фильтруем, если какого-то превью нет
  
  return searchRecords
}