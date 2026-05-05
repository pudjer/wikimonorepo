import { DAG, NoNodeInGraphError } from "../DAG/entity";
import { type IHasStage, LearningStats } from "./stats";



export class StatsBuilder<T extends IHasStage> {
    private readonly statsMap: Map<T, LearningStats<T>> = new Map();
    constructor(
        public readonly dag: DAG<T>
    ){
        for(const node of dag.nodes){
            const stats = new LearningStats(
                node, 
                (): ReadonlySet<LearningStats<T>> => new Set(this.dag.getAncestors(node).values().map(ancestor => this.getStats(ancestor))), 
                (): ReadonlySet<LearningStats<T>> => new Set(this.dag.getDescendants(node).values().map(descendant => this.getStats(descendant)))
            );
            this.statsMap.set(node, stats)
        }
        for(const stats of this.statsMap.values()){
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