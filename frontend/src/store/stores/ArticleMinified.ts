import api from "../../api";
import { ArticleFull, ArticleFullRule } from "./ArticleFull";
import { ArticleBase } from "./ArticleBase";
import { buildRule, resolveOutside } from "../../lib/observableStoreConfig";

export class ArticleMinified extends ArticleBase{
  title: string;
  async getFullArticle(): Promise<ArticleFull> {
    return await resolveOutside(this.id, ArticleFullRule);
  }
}

export const ArticleMinifiedRule = buildRule(
  async (id: string) => await api.publicArticles.getMinifiedById(id),
  { classConstructor: ArticleMinified }
)