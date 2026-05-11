import { LearnProgressStage } from "backend/src/domain/interactionUserArticle/learnProgress/entity"
import { autorun } from "../../lib"


export type GetRelated<T extends IHasStage> = () => ReadonlySet<LearningStats<T>>

declare const LearningDescendantsCountSymbol: unique symbol
export type LearningDescendantsCount = number & { _brand: typeof LearningDescendantsCountSymbol}
declare const MasteredDescendantsCountSymbol: unique symbol
export type MasteredDescendantsCount = number & { _brand: typeof MasteredDescendantsCountSymbol}
declare const MasteredAncestorsCountSymbol: unique symbol
export type MasteredAncestorsCount = number & { _brand: typeof MasteredAncestorsCountSymbol}
declare const TransitiveMasteredAncestorsCountSymbol: unique symbol
export type TransitiveMasteredAncestorsCount = number & { _brand: typeof TransitiveMasteredAncestorsCountSymbol}
export interface IHasStage {
    learnProgressStage: LearnProgressStage
}
export class LearningStats<T extends IHasStage>{
    private _learningDescendantsCount: LearningDescendantsCount = 0 as LearningDescendantsCount
    private _masteredDescendantsCount: MasteredDescendantsCount = 0 as MasteredDescendantsCount
    private _masteredAncestorsCount: MasteredAncestorsCount = 0 as MasteredAncestorsCount
    private _transitiveMasteredAncestorsCount: TransitiveMasteredAncestorsCount = 0 as TransitiveMasteredAncestorsCount
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
        this._masteredAncestorsCount = (this._masteredAncestorsCount + count) as MasteredAncestorsCount
    }
    addLearningDescendant(count: number): void {
        this._learningDescendantsCount = (this._learningDescendantsCount + count) as LearningDescendantsCount
    }
    addTransitiveMasteredAncestor(count: number): void {
        this._transitiveMasteredAncestorsCount = (this._transitiveMasteredAncestorsCount + count) as TransitiveMasteredAncestorsCount
    }
    addMasteredDescendant(count: number): void {
        const previous = this.isTransitiveMastered()
        this._masteredDescendantsCount = (this._masteredDescendantsCount + count) as MasteredDescendantsCount
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
        return this._masteredAncestorsCount / total
    }
    getTransitiveAncestorsMasteringDegree(): number{
        const total = this.getAncestors().size
        if (total === 0) return 1
        return this._transitiveMasteredAncestorsCount / total
    }
    getScore(): number{
        if(this.isMastered()) return 0
        const isLearningFactor = this.isLearning() ? 1 : 0
        return (this._learningDescendantsCount + isLearningFactor) * this.getAncestorsMasteringDegree()
    }

    
    
    
    ////PUBLIC
    init(): void {
        this.setStage(this._value.learnProgressStage)
    }


    
    isMastered(): boolean{
        return this.valueStage === LearnProgressStage.Mastered
    }
    isLearning(): boolean{
        return this.valueStage === LearnProgressStage.Learning
    }
    isTransitiveMastered(): boolean{
        return this._masteredDescendantsCount > 0 || this.isMastered()
    }
    isTransitiveLearning(): boolean{
        return this._learningDescendantsCount > 0 || this.isLearning()
    }
    getTransitiveScore(): number{
        if(this.isMastered()) return 0
        const isLearningFactor = this.isLearning() ? 1 : 0
        return (this._learningDescendantsCount + isLearningFactor) * this.getTransitiveAncestorsMasteringDegree()
    }


}