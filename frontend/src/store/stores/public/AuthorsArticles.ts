import queryApi from "../../../api/queryApi";
import { f } from "../../../lib";
import { ArticlePreview, ArticlePreviewCollectionRule } from "./ArticlePreview";




export const AuthorsArticlesRule = f.buildRule(
  async (id: string) => await queryApi.public.articles.getByAuthorId(id),
  { 
    classConstructor: Array<ArticlePreview>, 
    update: async (target, data, resolve) => { 
      target.length = 0
      const previews = await ArticlePreviewCollectionRule.resolveInside(resolve, data.ids.toSorted());
      target.push(...previews)
    } 
  }
)