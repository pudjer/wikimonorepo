/* eslint-disable @typescript-eslint/no-unused-vars */
import { NonNegativeIntegerVO } from "backend/src/domain/utils/valueObjects"
import { LearnProgressStage } from "../../api"


export type GetRelated<T extends IHasStage> = () => ReadonlySet<LearningStats<T>>

declare const LearningDescendantsCountSymbol: unique symbol
export class LearningDescendantsCount extends NonNegativeIntegerVO<typeof LearningDescendantsCountSymbol> {}
declare const MasteredDescendantsCountSymbol: unique symbol
export class MasteredDescendantsCount extends NonNegativeIntegerVO<typeof MasteredDescendantsCountSymbol> {}
declare const MasteredAncestorsCountSymbol: unique symbol
export class MasteredAncestorsCount extends NonNegativeIntegerVO<typeof MasteredAncestorsCountSymbol> {}
declare const TransitiveMasteredAncestorsCountSymbol: unique symbol
export class TransitiveMasteredAncestorsCount extends NonNegativeIntegerVO<typeof TransitiveMasteredAncestorsCountSymbol> {}
export interface IHasStage {
    learnProgressStage: LearnProgressStage
}
export class LearningStats<T extends IHasStage>{
    private _learningDescendantsCount: LearningDescendantsCount = new LearningDescendantsCount(0)
    private _masteredDescendantsCount: MasteredDescendantsCount = new MasteredDescendantsCount(0)
    private _masteredAncestorsCount: MasteredAncestorsCount = new MasteredAncestorsCount(0)
    private _transitiveMasteredAncestorsCount: TransitiveMasteredAncestorsCount = new TransitiveMasteredAncestorsCount(0)
    private valueStage: LearnProgressStage = LearnProgressStage.Unknown

    constructor(
        private readonly _value: T,
        private getAncestors: GetRelated<T>,
        private getDescendants: GetRelated<T>,
    ){}

    get value(): Readonly<T> & {readonly learnProgressStage: T["learnProgressStage"]} { return this._value }
    get learningDescendantsCount(): LearningDescendantsCount { return this._learningDescendantsCount }
    get masteredDescendantsCount(): MasteredDescendantsCount { return this._masteredDescendantsCount }
    get masteredAncestorsCount(): MasteredAncestorsCount { return this._masteredAncestorsCount }
    get transitiveMasteredAncestorsCount(): TransitiveMasteredAncestorsCount { return this._transitiveMasteredAncestorsCount }

    addMasteredAncestor(count: number): void {
        this._masteredAncestorsCount = this._masteredAncestorsCount.add(count)
    }
    addLearningDescendant(count: number): void {
        this._learningDescendantsCount = this._learningDescendantsCount.add(count)
    }
    addTransitiveMasteredAncestor(count: number): void {
        this._transitiveMasteredAncestorsCount = this._transitiveMasteredAncestorsCount.add(count)
    }
    addMasteredDescendant(count: number): void {
        const previous = this.isTransitiveMastered()
        this._masteredDescendantsCount = this._masteredDescendantsCount.add(count)
        const current = this.isTransitiveMastered()

        if(previous !== current){
            if(current){
                this.getDescendants().forEach((descendant) => descendant.addTransitiveMasteredAncestor(1))
            }else if(previous){
                this.getDescendants().forEach((descendant) => descendant.addTransitiveMasteredAncestor(-1))
            }
        }
    }



    
    setStage(stage: LearnProgressStage): void {
        const prev = this.valueStage
        if (stage === prev) return
    
        if (stage === LearnProgressStage.Mastered) this.beforeMastered()
        else if (prev === LearnProgressStage.Mastered) this.beforeUnmastered()
    
        if (stage === LearnProgressStage.Learning) this.beforeLearning()
        else if (prev === LearnProgressStage.Learning) this.beforeUnlearning()
    
        this._value.learnProgressStage = stage
        this.valueStage = stage
    }


    private beforeMastered(): void {
        if(this.isMastered()) return

        this.getAncestors().forEach((ancestor) => ancestor.addMasteredDescendant(1))
        this.getDescendants().forEach((descendant) => descendant.addMasteredAncestor(1))

        if(!this.isTransitiveMastered()){
            this.getDescendants().forEach((descendant) => descendant.addTransitiveMasteredAncestor(1))
        }
        
    }
    private beforeUnmastered(): void {
        if(!this.isMastered()) return

        this.getAncestors().forEach((ancestor) => ancestor.addMasteredDescendant(-1))
        this.getDescendants().forEach((descendant) => descendant.addMasteredAncestor(-1))

        if(!this.isTransitiveMastered()){
            this.getDescendants().forEach((descendant) => descendant.addTransitiveMasteredAncestor(-1))
        }
    }
    private beforeLearning(): void {
        if(this.isLearning()) return

        this.getAncestors().forEach((ancestor) => ancestor.addLearningDescendant(1))
    }
    private beforeUnlearning(): void {
        if(!this.isLearning()) return

        this.getAncestors().forEach((ancestor) => ancestor.addLearningDescendant(-1))
    }

    getAncestorsMasteringDegree(): number{
        const total = this.getAncestors().size
        if (total === 0) return 1
        return this._masteredAncestorsCount.value / total
    }
    getTransitiveAncestorsMasteringDegree(): number{
        const total = this.getAncestors().size
        if (total === 0) return 1
        return this._transitiveMasteredAncestorsCount.value / total
    }
    getScore(): number{
        return this._learningDescendantsCount.value * this.getAncestorsMasteringDegree()
    }




    ////PUBLIC
    isMastered(): boolean{
        return this.valueStage === LearnProgressStage.Mastered
    }
    isLearning(): boolean{
        return this.valueStage === LearnProgressStage.Learning
    }
    isTransitiveMastered(): boolean{
        return this._masteredDescendantsCount.value > 0 || this.isMastered()
    }
    isTransitiveLearning(): boolean{
        return this._learningDescendantsCount.value > 0 || this.isLearning()
    }
    init(): void {
        this.setStage(this._value.learnProgressStage)
    }
    getTransitiveScore(): number{
        return this._learningDescendantsCount.value * this.getTransitiveAncestorsMasteringDegree()
    }


}