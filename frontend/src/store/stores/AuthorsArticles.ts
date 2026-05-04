import api from "../../api";
import { buildRule, resolveOutside } from "../../lib/observableStoreConfig";
import { ArticlePreview, ArticlePreviewCollectionRule } from "./ArticlePreview";




export const AuthorsArticlesRule = buildRule(
  async (id: string) => await api.public.articles.getByAuthorId(id),
  { 
    classConstructor: Array<ArticlePreview>, 
    update: async (target, data) => { 
      target.length = 0
      const sortedIdsAmpersandTerminated = data.ids.toSorted().join("&")
      const previews = await resolveOutside(sortedIdsAmpersandTerminated, ArticlePreviewCollectionRule)
      target.push(...previews)
    } 
  }
)