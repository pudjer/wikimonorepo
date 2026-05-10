import queryApi from "../../../api/queryApi";
import { f } from "../../../lib";
import { arrayToString } from "../../stringArray";
import { ArticlePreview, ArticlePreviewCollectionRule } from "./ArticlePreview";




export const AuthorsArticlesRule = f.buildRule(
  async (id: string) => await queryApi.public.articles.getByAuthorId(id),
  { 
    classConstructor: Array<ArticlePreview>, 
    update: async (target, data, resolve) => { 
      target.length = 0
      const sortedIdsAmpersandTerminated = arrayToString(data.ids);
      const previews = await ArticlePreviewCollectionRule.resolveInside(resolve, sortedIdsAmpersandTerminated);
      target.push(...previews)
    } 
  }
)