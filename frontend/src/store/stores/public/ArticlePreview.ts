import api from "../../../api";
import { buildRule, resolveOutside } from "../../../lib/observableStoreConfig";
import { ArticleBase } from "./ArticleBase";
import { Article, ArticleRule } from "./ArticleFull";

export class ArticlePreview extends ArticleBase{
  views: number;
  likes: number;
  learners: number;
  masters: number;
  dagPoints: number;
  async getArticle(): Promise<Article> {
    return await resolveOutside(this.id, ArticleRule);
  }
}

export const ArticlePreviewRule = buildRule(
  async (id: string) => await api.public.articlePreview.getById(id),
  { classConstructor: ArticlePreview }
)

export const ArticlePreviewCollectionRule = buildRule(
  async (sortedIdsAmpersandTerminated: string) => {
    const ids = sortedIdsAmpersandTerminated.split("&").filter(id => id !== "");
    const res = await api.public.articlePreview.getByIds({ ids })
    return res.previews;
  },
  { 
    classConstructor: Array<ArticlePreview>,
    update: async (target, data, resolve) => {
      target.length = 0;
      for (const preview of data) {
        target.push(await resolve(preview.id, ArticlePreviewRule, preview));
      }
    },
  }
)
