import { MyProfile, MyProfileRule } from "./MeBuild/MyProfile";
import { TotalInteraction, MyInteractionsRule } from "./TotalInteractions";
import { checkIsAdmin } from "./MeBuild/CheckIsAdmin";
import { MyLearningHistoryRule } from "./MeBuild/MyLearningHystory";
import { MyLearningStats, MyLearningStatsRule } from "./MeBuild/LearningStats";
import { f } from "../../../lib";
import { ArticlePreview, ArticlePreviewCollectionRule } from "../public/ArticlePreview";

export class Me{
  isAdmin: boolean
  profile: MyProfile
  history: TotalInteraction[]
  learningHistory: TotalInteraction[]
  historyPreviews: ArticlePreview[]
  myLearningStats: MyLearningStats
}

export const MeRule = f.buildRule(
  async (myId: string) => {},
  { 
    classConstructor: Me, 
    update: async (target, data, resolve, myId: string) => {
      target.profile = await MyProfileRule.resolveInside(resolve, myId);
      target.isAdmin = await checkIsAdmin(target.profile.id);
      target.history = await MyInteractionsRule.resolveInside(resolve, myId);
      target.learningHistory = await MyLearningHistoryRule.resolveInside(resolve, myId);
      const articleIds = target.history.map(h => h.articleId).toSorted()
      target.historyPreviews = await ArticlePreviewCollectionRule.resolveInside(resolve, articleIds);
      target.myLearningStats = await MyLearningStatsRule.resolveInside(resolve, myId);
    } 
  }
)

