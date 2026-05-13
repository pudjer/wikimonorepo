import { autorun } from "../../lib";
import { DAG, NoNodeInGraphError } from "../DAG/entity";
import { type IHasStage, LearningStats } from "./stats";



export class StatsBuilder<T extends IHasStage> {
    private readonly statsMap: Map<T, LearningStats<T>> = new Map();
    constructor(
        public readonly dag: DAG<T>
    ){
        for(const node of dag.nodes){
            let ancestors: Set<LearningStats<T>> | undefined
            let descendants:Set< LearningStats<T>> | undefined
            const stats = autorun.registerObject(new LearningStats(
                node, 
                (): ReadonlySet<LearningStats<T>> => {
                    if(ancestors){
                        return ancestors
                    }else{
                        ancestors = new Set(this.dag.getAncestors(node).values().map(ancestor => this.getStats(ancestor)))
                        return ancestors
                    }
                }, 
                (): ReadonlySet<LearningStats<T>> => {
                    if(descendants){
                        return descendants
                    }else{
                        descendants = new Set(this.dag.getDescendants(node).values().map(descendant => this.getStats(descendant)))
                        return descendants
                    }
                }
            ));
            this.statsMap.set(node, stats)
        }
    }

    public getStats<CONC extends T>(node: CONC): LearningStats<CONC> {
        const stats = this.statsMap.get(node) as (LearningStats<CONC> | undefined);
        if(!stats){
            throw new NoNodeInGraphError();
        }
        return stats;
    }
    public getAllStats(): LearningStats<T>[] {
        return Array.from(this.statsMap.values());
    }

}