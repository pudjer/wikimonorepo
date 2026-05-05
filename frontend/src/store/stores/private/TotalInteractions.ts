import api, { LearnProgressStage } from "../../../api";
import { buildRule, resolveOutside } from "../../../lib/observableStoreConfig";
import { ArticlePreview, ArticlePreviewRule } from "../public/ArticlePreview";

export class TotalInteraction {
      userId: string;
      articleId: string;
      isViewed: boolean;
      isLiked: boolean;
      learnProgressStage: LearnProgressStage;
      lastInteraction: Date | null;
      async getPreview(): Promise<ArticlePreview> {
        return await resolveOutside(this.articleId, ArticlePreviewRule);
      }
}

export const TotalInteractionsRule = buildRule(
  async (articleId: string) => {
    return await api.private.interactionUserArticle.total.getTotal(articleId);
  },
  { 
    classConstructor: TotalInteraction, 
    async update(target, data) {
      target.userId = data.userId;
      target.articleId = data.articleId;
      target.isViewed = data.isViewed;
      target.isLiked = data.isLiked;
      target.learnProgressStage = data.learnProgressStage;
      target.lastInteraction = data.lastInteraction ? new Date(data.lastInteraction) : null;
    },
  }
);
export const TotalInteractionsCollectionRule = buildRule(
  async (idsSortedAmpersandTerminated: string) => {
    const ids = idsSortedAmpersandTerminated.split("&").filter(id => id !== "");
    return await api.private.interactionUserArticle.total.getTotalByIds(ids);
  },
  { 
    classConstructor: Array<TotalInteraction>,
    async update(target, data, resolve) {
      target.length = 0;
      for (const interaction of data) {
        target.push(await resolve(interaction.articleId, TotalInteractionsRule, interaction));
      }
    },
  }
)
export const MyInteractionsRule = buildRule(
  async () => {
    return await api.private.interactionUserArticle.total.getTotalAll();
  },
  { 
    classConstructor: Array<TotalInteraction>,
    async update(target, data, resolve) {
      target.length = 0;
      for (const interaction of data) {
        target.push(await resolve(interaction.articleId, TotalInteractionsRule, interaction));
      }
      target.sort((a, b) => {
        if(a.lastInteraction === null) return 1;
        if(b.lastInteraction === null) return -1;
        return b.lastInteraction.getTime() - a.lastInteraction.getTime();
      });
    },
  }
);