import { MyProfile, MyProfileRule } from "./MeBuild/MyProfile";
import { TotalInteraction, MyInteractionsRule } from "./TotalInteractions";
import { checkIsAdmin } from "./MeBuild/CheckIsAdmin";
import { MyLearningHistoryRule } from "./MeBuild/MyLearningHystory";
import { MyLearningStats, MyLearningStatsRule } from "./MeBuild/LearningStats";
import { f } from "../../../lib";

export class Me{
  isAdmin: boolean
  profile: MyProfile
  history: TotalInteraction[]
  historyCash: Map<string, TotalInteraction> 
  learningHistory: TotalInteraction[]
  myLearningStats: MyLearningStats
}

export const MeRule = f.buildRule(
  async () => {},
  { 
    classConstructor: Me, 
    update: async (target, data, resolve) => {
      target.profile = await MyProfileRule.resolveInside(resolve, undefined);
      target.isAdmin = await checkIsAdmin(target.profile.id);
      target.history = await MyInteractionsRule.resolveInside(resolve, undefined);
      target.historyCash = new Map(target.history.map(h => [h.articleId, h]));
      target.learningHistory = await MyLearningHistoryRule.resolveInside(resolve, undefined);
      target.myLearningStats = await MyLearningStatsRule.resolveInside(resolve, undefined);
    } 
  }
)

