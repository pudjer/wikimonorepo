import { MyProfile, MyProfileRule } from "./MeBuild/MyProfile";
import { TotalInteraction, MyInteractionsRule } from "./TotalInteractions";
import { DAGRule, PreviewDAG } from "../public/DAG";
import { checkIsAdmin } from "./MeBuild/CheckIsAdmin";
import { MyLearningHistoryRule } from "./MeBuild/MyLearningHystory";
import { MyLearningStats, MyLearningStatsRule } from "./MeBuild/LearningStats";
import { f } from "../../../lib";

export class Me{
  isAdmin: boolean
  profile: MyProfile
  history: TotalInteraction[]
  learningHistory: TotalInteraction[]
  myDAG: PreviewDAG
  myStatsDAGCash: MyLearningStats
}

export const MeRule = f.buildRule(
  async () => {},
  { 
    classConstructor: Me, 
    update: async (target, data, resolve) => {
      target.profile = await MyProfileRule.resolveInside(resolve, undefined);
      target.isAdmin = await checkIsAdmin(target.profile.id);
      target.history = await MyInteractionsRule.resolveInside(resolve, undefined);
      target.learningHistory = await MyLearningHistoryRule.resolveInside(resolve, undefined);
      const learningIds = target.learningHistory.map(i => i.articleId).toSorted().join("&");
      target.myDAG = await DAGRule.resolveInside(resolve, learningIds);
      target.myStatsDAGCash = await MyLearningStatsRule.resolveInside(resolve, undefined);
    } 
  }
)

