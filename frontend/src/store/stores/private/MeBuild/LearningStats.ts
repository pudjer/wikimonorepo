import { NodeRelations } from "backend/src/domain/articleDAG/entity";
import { Link } from "backend/src/domain/common/entity";
import { UniqueCollection } from "backend/src/domain/utils/collections";
import api from "../../../../api";
import { DAG } from "../../../../domain/DAG/entity";
import { StatsBuilder } from "../../../../domain/learningDAG/statsDag";
import { buildRule, autorun } from "../../../../lib/observableStoreConfig";
import { TotalInteraction, TotalInteractionsCollectionRule } from "../TotalInteractions";
import { MyLearningHistoryRule } from "./MyLearningHystory";


export class MyLearningStats extends StatsBuilder<TotalInteraction> { }

export const MyLearningStatsRule = buildRule(
  async () => { },
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
);






export class LearningDAG extends DAG<TotalInteraction> { }

export const MyLearningDAGRule = buildRule(
  async () => { },
  {
    classConstructor: LearningDAG,
    update: async (target, data, resolve) => {
      const learning = await resolve(undefined, MyLearningHistoryRule);
      const learningArticleIds = learning.map(i => i.articleId);

      const { links, nodes } = await api.public.articleDAG.getDAG(learningArticleIds);

      const nodesSortedAmpersandTerminated = nodes.toSorted().join("&");
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
);
