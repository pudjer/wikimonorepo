import { Link, UniqueLinkCollection } from "backend/src/domain/common/entity";
import { DAG, NoNodeInGraphError } from "../DAG/entity";
import { type IHasStage, LearningStats } from "./stats";


type ChildToParent<Node> = Link<Node, unknown, Node>
type NodeRelations<Node> = UniqueLinkCollection<ChildToParent<Node>>

export class StatsBuilder<T extends IHasStage> {
    public readonly dag: DAG<LearningStats<T>>
    public readonly statsSet: Set<LearningStats<T>> = new Set();
    private readonly statsMap: Map<T, LearningStats<T>> = new Map();
    constructor(
        public readonly nodes: ReadonlySet<T>,
        public readonly links: NodeRelations<T>
    ){
        for(const node of nodes){
            const stats = new LearningStats(
                node, 
                (): ReadonlySet<LearningStats<T>> => this.dag!.getAncestors(stats), 
                (): ReadonlySet<LearningStats<T>> => this.dag!.getDescendants(stats)
            );
            this.statsMap.set(node, stats)
            this.statsSet.add(stats)
        }
        const statsLinks = new Set<ChildToParent<LearningStats<T>>>()
        for(const link of links.values){
            const statsChild = this.getStats(link.child)
            const statsParent = this.getStats(link.parent)
            const statsLink = new Link<LearningStats<T>, unknown, LearningStats<T>>(statsChild, link.name, statsParent)
            statsLinks.add(statsLink)
        }
        this.dag = new DAG(this.statsSet, new UniqueLinkCollection(statsLinks));
        for(const [_, stats] of this.statsMap){
            stats.init()
        }
    }

    private getStats(node: T): LearningStats<T> {
        const stats = this.statsMap.get(node);
        if(!stats){
            throw new NoNodeInGraphError();
        }
        return stats;
    }

}