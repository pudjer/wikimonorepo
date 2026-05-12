import { autorun } from "../../lib";
import { DAG, NoNodeInGraphError } from "../DAG/entity";
import { type IHasStage, LearningStats } from "./stats";



export class StatsBuilder<T extends IHasStage> {
    private readonly statsMap: Map<T, LearningStats<T>> = new Map();
    constructor(
        dag: DAG<T>
    ){
        for(const node of dag.nodes){
            const ancestors = new Set(dag.getAncestors(node).values().map(ancestor => this.getStats(ancestor)))
            const descendants = new Set(dag.getDescendants(node).values().map(descendant => this.getStats(descendant)))
            const stats = autorun.registerObject(new LearningStats(
                node, 
                (): ReadonlySet<LearningStats<T>> => ancestors, 
                (): ReadonlySet<LearningStats<T>> => descendants
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