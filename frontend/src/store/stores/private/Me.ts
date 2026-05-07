import { buildRule } from "../../../lib/observableStoreConfig";
import { MyProfile, MyProfileRule } from "./MeBuild/MyProfile";
import { TotalInteraction, MyInteractionsRule } from "./TotalInteractions";
import { DAGRule, PreviewDAG } from "../public/DAG";
import { checkIsAdmin } from "./MeBuild/CheckIsAdmin";
import { MyLearningHistoryRule } from "./MeBuild/MyLearningHystory";
import { MyLearningStats, MyLearningStatsRule } from "./MeBuild/LearningStats";

export class Me{
  isAdmin: boolean
  profile: MyProfile
  history: TotalInteraction[]
  learningHistory: TotalInteraction[]
  myDAG: PreviewDAG
  myStatsDAGCash: MyLearningStats
}

export const MeRule = buildRule(
  async () => {},
  { 
    classConstructor: Me, 
    update: async (target, data, resolve) => {
      target.profile = await resolve(undefined, MyProfileRule);
      target.isAdmin = await checkIsAdmin(target.profile.id);
      target.history = await resolve(undefined, MyInteractionsRule)
      target.learningHistory = await resolve(undefined, MyLearningHistoryRule);
      const learningIds = target.learningHistory.map(i => i.articleId).toSorted().join("&");
      target.myDAG = await resolve(learningIds, DAGRule);
      target.myStatsDAGCash = await resolve(undefined, MyLearningStatsRule);
    } 
  }
)

