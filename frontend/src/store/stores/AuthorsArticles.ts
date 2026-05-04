import api from "../../api";
import { buildRule, resolveOutside } from "../../lib/observableStoreConfig";
import { ArticleMinified, ArticleMinifiedRule } from "./ArticleMinified";




export const AuthorsArticlesRule = buildRule(
  async (id: string) => await api.publicArticles.getByAuthorId(id),
  { 
    classConstructor: Array<ArticleMinified>, 
    update: async (target, data) => { 
      target.length = 0
      for (const articleId of data.ids) {
        target.push(await resolveOutside(articleId, ArticleMinifiedRule));
      }
    } 
  }
)