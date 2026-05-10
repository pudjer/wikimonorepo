import { NodeRelations } from "backend/src/domain/articleDAG/entity";
import api from "../../../api";
import { DAG } from "../../../domain/DAG/entity";
import { ArticlePreview, ArticlePreviewCollectionRule } from "./ArticlePreview";
import { UniqueCollection } from "backend/src/domain/utils/collections";
import { Link } from "backend/src/domain/common/entity";
import { f } from "../../../lib";

export class PreviewDAG extends DAG<ArticlePreview> {}

export const DAGRule = f.buildRule(
  async (sortedIdsAmpersandTerminated: string) => {
    const ids = sortedIdsAmpersandTerminated.split("&").filter(id => id !== "");
    return await api.public.articleDAG.getDAG(ids);
  },
  { 
    classConstructor: PreviewDAG,
    update: async (target, data, resolve) => { 
      const ids = data.nodes.toSorted().join("&");
      const previews = await ArticlePreviewCollectionRule.resolveInside(resolve, ids);
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