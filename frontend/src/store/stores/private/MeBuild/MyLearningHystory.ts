import { LearnProgressStage } from "../../../../api";
import { buildRule } from "../../../../lib/observableStoreConfig";
import { TotalInteraction, MyInteractionsRule } from "../TotalInteractions";


export const MyLearningHistoryRule = buildRule(
  async () => { },
  {
    classConstructor: (Array<TotalInteraction>),
    update: async (target, data, resolve) => {
      const interactions = await resolve(undefined, MyInteractionsRule);
      const filetered = interactions.filter(p => p.learnProgressStage !== LearnProgressStage.Unknown);
      target.length = 0;
      target.push(...filetered);
    }
  }
);
