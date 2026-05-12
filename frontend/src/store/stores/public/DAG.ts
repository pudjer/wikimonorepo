import { NodeRelations } from "backend/src/domain/articleDAG/entity";
import queryApi from "../../../api/queryApi";
import { DAG } from "../../../domain/DAG/entity";
import { Preview, PreviewListRule, PreviewRule } from "./ArticlePreview";
import { UniqueCollection } from "backend/src/domain/utils/collections";
import { Link } from "backend/src/domain/common/entity";
import { f } from "../../../lib";

export class DAGLink{
  constructor(
    public child: Preview,
    public name: string,
    public parent: Preview
  ){}

}

export class PreviewDAG{
  constructor(
    public nodes: Preview[],
    public links: DAGLink[]
  ){}
}

export const DAGRule = f.buildRule(
  async (sortedIds: string[]) => {
    return await queryApi.public.articleDAG.getDAG(sortedIds);
  },
  { 
    classConstructor: PreviewDAG,
    update: async (target, data, resolve) => { 
      const ids = data.nodes.toSorted()
      const nodes = await PreviewListRule.resolveInside(resolve, ids)
      const nodesMap = new Map(nodes.map(n=>[n.id, n]))
      const links = data.links.map(l=>new DAGLink(nodesMap.get(l.child)!, l.name, nodesMap.get(l.parent)!))
      Object.assign(target, new PreviewDAG(nodes, links))
    }
  }
)