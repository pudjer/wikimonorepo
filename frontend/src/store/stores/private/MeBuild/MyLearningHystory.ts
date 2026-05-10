import { LearnProgressStage } from "backend/src/domain/interactionUserArticle/learnProgress/entity";
import { f } from "../../../../lib";
import { MyInteractionsRule, TotalInteraction } from "../TotalInteractions";


export const MyLearningHistoryRule = f.buildRule(
  async () => { },
  {
    classConstructor: (Array<TotalInteraction>),
    update: async (target, data, resolve) => {
      const interactions = await MyInteractionsRule.resolveInside(resolve, undefined);
      const filetered = interactions.filter(p => p.learnProgressStage !== LearnProgressStage.Unknown);
      target.length = 0;
      target.push(...filetered);
    }
  }
);
