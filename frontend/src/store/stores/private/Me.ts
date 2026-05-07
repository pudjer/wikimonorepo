import { UniqueCollection } from "backend/src/domain/utils/collections";
import { DAG } from "../../../domain/DAG/entity";
import { StatsBuilder } from "../../../domain/learningDAG/statsDag";
import { autorun, buildRule } from "../../../lib/observableStoreConfig";
import { MyProfile, MyProfileRule } from "./MyProfile";
import { TotalInteraction, MyInteractionsRule, TotalInteractionsCollectionRule } from "./TotalInteractions";
import { NodeRelations } from "backend/src/domain/articleDAG/entity";
import api, { LearnProgressStage } from "../../../api";
import { Link } from "backend/src/domain/common/entity";
import { DAGRule, PreviewDAG } from "../public/DAG";
import { AxiosError } from "axios";

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
      try{
        await api.admin.user.get(target.profile.id);
        target.isAdmin = true;  
      }catch(e) {
        if (e instanceof AxiosError && e.status === 403) {
          target.isAdmin = false;
        }else{
          console.error(e);
        }
      }
      target.history = await resolve(undefined, MyInteractionsRule)
      target.learningHistory = await resolve(undefined, MyLearningHistoryRule);
      const learningIds = target.learningHistory.map(i => i.articleId);
      target.myDAG = await resolve(learningIds.toSorted().join("&"), DAGRule);
      target.myStatsDAGCash = await resolve(undefined, MyLearningStatsRule);
    } 
  }
)

export const MyLearningHistoryRule = buildRule(
  async () => {},
  {
    classConstructor: Array<TotalInteraction>,
    update: async (target, data, resolve) => {
      const interactions = await resolve(undefined, MyInteractionsRule);
      const filetered = interactions.filter(p => p.learnProgressStage !== LearnProgressStage.Unknown);
      target.length = 0;
      target.push(...filetered);
    }
  }
)


export class MyLearningStats extends StatsBuilder<TotalInteraction>{}

export const MyLearningStatsRule = buildRule(
  async () => {},
  { 
    classConstructor: MyLearningStats, 
    update: async (target, data, resolve) => {
      const dag = await resolve(undefined, MyLearningDAGRule);
      const res = new MyLearningStats(dag);
      for (const stat of res.getAllStats()) {
        autorun.autorun(() => stat.init());
      }
      Object.assign(target, res);
    } 
  }
)






export class LearningDAG extends DAG<TotalInteraction>{}

export const MyLearningDAGRule = buildRule(
  async () => {},
  { 
    classConstructor: LearningDAG, 
    update: async (target, data, resolve) => {
      const learning = await resolve(undefined, MyLearningHistoryRule);
      const learningArticleIds = learning.map(i => i.articleId);

      const { links, nodes } = await api.public.articleDAG.getDAG(learningArticleIds);

      const nodesSortedAmpersandTerminated = nodes.toSorted().join("&")
      const allNodes = await resolve(nodesSortedAmpersandTerminated, TotalInteractionsCollectionRule);

      const interactionMap = new Map(allNodes.map(p => [p.articleId, p]));

      const dagLinks: NodeRelations<TotalInteraction, string> = new UniqueCollection(
        links.map(
          l => new Link(
            interactionMap.get(l.child)!, 
            l.name, 
            interactionMap.get(l.parent)!
          )
        )
      );
      const dag = new LearningDAG(new Set(allNodes), dagLinks);

      Object.assign(target, dag);
    } 
  }
)