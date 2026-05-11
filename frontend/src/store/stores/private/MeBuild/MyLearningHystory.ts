import { LearnProgressStage } from "backend/src/domain/interactionUserArticle/learnProgress/entity";
import { f } from "../../../../lib";
import { MyInteractionsRule, TotalInteraction } from "../TotalInteractions";


export const MyLearningHistoryRule = f.buildRule(
  async (myId: string) => { },
  {
    classConstructor: (Array<TotalInteraction>),
    update: async (target, data, resolve, myId: string) => {
      const interactions = await MyInteractionsRule.resolveInside(resolve, myId);
      const filetered = interactions.filter(p => p.learnProgressStage !== LearnProgressStage.Unknown);
      target.length = 0;
      target.push(...filetered);
    }
  }
);
