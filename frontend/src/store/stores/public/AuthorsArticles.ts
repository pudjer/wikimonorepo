import api from "../../../api";
import { f } from "../../../lib";
import { ArticlePreview, ArticlePreviewCollectionRule } from "./ArticlePreview";




export const AuthorsArticlesRule = f.buildRule(
  async (id: string) => await api.public.articles.getByAuthorId(id),
  { 
    classConstructor: Array<ArticlePreview>, 
    update: async (target, data, resolve) => { 
      target.length = 0
      const sortedIdsAmpersandTerminated = data.ids.toSorted().join("&")
      const previews = await ArticlePreviewCollectionRule.resolveInside(resolve, sortedIdsAmpersandTerminated);
      target.push(...previews)
    } 
  }
)