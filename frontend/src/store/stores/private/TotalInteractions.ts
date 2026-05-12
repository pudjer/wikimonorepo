import { LearnProgressStage } from "backend/src/domain/interactionUserArticle/learnProgress/entity";
import queryApi from "../../../api/queryApi";
import { f } from "../../../lib";

export class Interaction {
      userId: string;
      articleId: string;
      isViewed: boolean;
      isLiked: boolean;
      learnProgressStage: LearnProgressStage;
      lastInteraction: Date | null;
}

export const InteractionRule = f.buildRule(
  async ({articleId}: { articleId: string; myId: string }) => {
    return await queryApi.private.interactionUserArticle.total.getTotal(articleId);
  },
  { 
    classConstructor: Interaction, 
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
export const InteractionListRule = f.buildRule(
  async ({idsSorted}:{idsSorted: string[], myId: string}) => {
    return await queryApi.private.interactionUserArticle.total.getTotalByIds(idsSorted);
  },
  { 
    classConstructor: Array<Interaction>,
    async update(target, data, resolve, {myId}) {
      target.length = 0;
      for (const interaction of data) {
        target.push(await InteractionRule.resolveInside(resolve, {articleId: interaction.articleId, myId}, interaction));
      }
    },
  }
)
export const MyInteractionsRule = f.buildRule(
  async (myId: string) => {
    return await queryApi.private.interactionUserArticle.total.getTotalAll();
  },
  { 
    classConstructor: Array<Interaction>,
    async update(target, data, resolve, myId) {
      target.length = 0;
      for (const interaction of data) {
        target.push(await InteractionRule.resolveInside(resolve, {articleId: interaction.articleId, myId}, interaction));
      }
      target.sort((a, b) => {
        if(a.lastInteraction === null) return 1;
        if(b.lastInteraction === null) return -1;
        return b.lastInteraction.getTime() - a.lastInteraction.getTime();
      });
    },
  }
);