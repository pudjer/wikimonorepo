import { NodeRelations } from "backend/src/domain/articleDAG/entity";
import queryApi from "../../../api/queryApi";
import { DAG } from "../../../domain/DAG/entity";
import { ArticlePreview, ArticlePreviewCollectionRule } from "./ArticlePreview";
import { UniqueCollection } from "backend/src/domain/utils/collections";
import { Link } from "backend/src/domain/common/entity";
import { f } from "../../../lib";

export class PreviewDAG extends DAG<ArticlePreview> {}

export const DAGRule = f.buildRule(
  async (sortedIds: string[]) => {
    return await queryApi.public.articleDAG.getDAG(sortedIds);
  },
  { 
    classConstructor: PreviewDAG,
    update: async (target, data, resolve) => { 
      const previews = await ArticlePreviewCollectionRule.resolveInside(resolve, data.nodes.toSorted());
      const previewsSet = new Set(previews);
      const previewsMap = new Map(previews.map(p => [p.id, p]));
      const links: NodeRelations<ArticlePreview, string> = new UniqueCollection(
        data.links.map(
          l => new Link(
            previewsMap.get(l.child)!, 
            l.name, 
            previewsMap.get(l.parent)!
          )
        )
      );
      const builded = new PreviewDAG(previewsSet, links);
      Object.assign(target, builded);
    }
  }
)