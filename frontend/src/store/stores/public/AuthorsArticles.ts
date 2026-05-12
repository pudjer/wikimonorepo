import queryApi from "../../../api/queryApi";
import { f } from "../../../lib";
import { Preview, PreviewListRule } from "./ArticlePreview";




export const AuthorsArticlesRule = f.buildRule(
  async (id: string) => await queryApi.public.articles.getByAuthorId(id),
  { 
    classConstructor: Array<Preview>, 
    update: async (target, data, resolve) => { 
      target.length = 0
      const previews = await PreviewListRule.resolveInside(resolve, data.ids);
      target.push(...previews)
    } 
  }
)