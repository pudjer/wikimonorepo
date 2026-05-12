import { MyProfile, MyProfileRule } from "./MeBuild/MyProfile";
import { Interaction, MyInteractionsRule } from "./TotalInteractions";
import { checkIsAdmin } from "./MeBuild/CheckIsAdmin";
import { MyLearningHistoryRule } from "./MeBuild/MyLearningHystory";
import { f } from "../../../lib";
import { Preview, PreviewListRule } from "../public/ArticlePreview";

export class Me{
  isAdmin: boolean
  profile: MyProfile
  history: Interaction[]
  learningHistory: Interaction[]
  historyPreviews: Preview[]
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
      target.historyPreviews = await PreviewListRule.resolveInside(resolve, articleIds);
    } 
  }
)

