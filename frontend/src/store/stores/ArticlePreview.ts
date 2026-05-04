import api from "../../api";
import { buildRule, resolveOutside } from "../../lib/observableStoreConfig";
import { ArticleBase } from "./ArticleBase";
import { Article, ArticleRule } from "./ArticleFull";

export class ArticlePreview extends ArticleBase{
  articleId: string;
  title: string;
  views: number;
  likes: number;
  learners: number;
  masters: number;
  dagPoints: number;
  async getArticle(): Promise<Article> {
    return await resolveOutside(this.articleId, ArticleRule);
  }
}

export const ArticlePreviewRule = buildRule(
  async (id: string) => await api.public.articlePreview.getById(id),
  { classConstructor: ArticlePreview }
)

export const ArticlePreviewCollectionRule = buildRule(
  async (sortedIdsAmpersandTerminated: string) => {
    const ids = sortedIdsAmpersandTerminated.split("&");
    return await api.public.articlePreview.getByIds({ ids });
  },
  { 
    classConstructor: Array<ArticlePreview>,
    update: async (target, data) => {
      target.length = 0;
      for (const preview of data.previews) {
        target.push(await resolveOutside(preview.articleId, ArticlePreviewRule, preview));
      }
    },
  }
)
