import { UniqueCollection } from "backend/src/domain/utils/collections";
import { DAG } from "../../../domain/DAG/entity";
import { StatsBuilder } from "../../../domain/learningDAG/statsDag";
import { buildRule } from "../../../lib/observableStoreConfig";
import { MyProfile, MyProfileRule } from "./MyProfile";
import { TotalInteraction, MyInteractionsRule, TotalInteractionsCollectionRule } from "./TotalInteractions";
import { NodeRelations } from "backend/src/domain/articleDAG/entity";
import api, { LearnProgressStage } from "../../../api";
import { Link } from "backend/src/domain/common/entity";

export class Me{
  profile: MyProfile
  interactions: TotalInteraction[]
  myDAG: StatsBuilder<TotalInteraction>
}

export const MeRule = buildRule(
  async () => {},
  { 
    classConstructor: Me, 
    update: async (target, data, resolve) => {
      target.profile = await resolve(undefined, MyProfileRule);
      const dag = await resolve(undefined, MyInteractionDAGRule);
      target.myDAG = new StatsBuilder(dag);
    } 
  }
)


export class InteractionDAG extends DAG<TotalInteraction>{}

export const MyInteractionDAGRule = buildRule(
  async () => {},
  { 
    classConstructor: InteractionDAG, 
    update: async (target, data, resolve) => {
      const interactions = await resolve(undefined, MyInteractionsRule);
      const interactionIds = interactions.filter(p => p.learnProgressStage !== LearnProgressStage.Unknown).map(p => p.articleId);
      const { links, nodes } = await api.public.articleDAG.getDAG(interactionIds);
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
      const dag = new InteractionDAG(new Set(allNodes), dagLinks);
      Object.assign(target, dag);
    } 
  }
)