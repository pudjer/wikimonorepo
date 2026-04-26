import { ArticleId } from "../../article/props/articleId"
import { UserId } from "../../user/props/userId"
import { PastOrPresentDateVO, NonNegativePercentageVO } from "../../utils/valueObjects"
import { LearnProgressStage } from "../learnProgress/entity"

declare const LastInteractionSymbol: unique symbol
export class LastInteraction extends PastOrPresentDateVO<typeof LastInteractionSymbol>{}

declare const isViwedSymbol: unique symbol
export type IsViewed = boolean & {readonly [isViwedSymbol]: void}


declare const IsLikedSymbol: unique symbol
export type IsLiked = boolean & {readonly [IsLikedSymbol]: void}


export class TotalInteraction{
    constructor(
        public readonly articleId: ArticleId,
        public readonly userId: UserId,
        public readonly lastInteraction: LastInteraction | null,
        public readonly isViewed: IsViewed,
        public readonly isLiked: IsLiked,
        public readonly learnProgressStage: LearnProgressStage,
    ){}
}