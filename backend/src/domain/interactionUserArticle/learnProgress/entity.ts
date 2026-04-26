import { ArticleId } from "../../article/props/articleId";
import { UserId } from "../../user/props/userId";
import { PastOrPresentDateVO } from "../../utils/valueObjects";
import { BadValueError } from "../../common/domainErrors";

declare const UpdatedAtSymbol: unique symbol;
export class UpdatedAt extends PastOrPresentDateVO<typeof UpdatedAtSymbol>{}

export enum LearnProgressStage {
    Learning = "learning",
    Mastered = "mastered",
    Unknown = "unknown",
}


export class LearnProgress{
    private _updatedAt: UpdatedAt
    constructor(
        public readonly articleId: ArticleId,
        public readonly userId: UserId,
        public learnProgressStage: LearnProgressStage,
        updatedAt: UpdatedAt
    ){
        this._updatedAt = updatedAt
    }
    public get updatedAt(): UpdatedAt {
        return this._updatedAt
    }

    update(stage: LearnProgressStage): void {
        this.learnProgressStage = stage;
        this._updatedAt = new UpdatedAt(new Date());
    }           
    static createNew(articleId: ArticleId, userId: UserId, stage: LearnProgressStage): LearnProgress {
        return new LearnProgress(articleId, userId, stage, new UpdatedAt(new Date()));
    }
}
