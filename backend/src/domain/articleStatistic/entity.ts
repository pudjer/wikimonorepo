import { ArticleId } from "../article/props/articleId"
import { BadValueError } from "../common/domainErrors"
import { NonNegativeIntegerVO } from "../utils/valueObjects"



declare const ViewsNumberSymbol: unique symbol
export class ViewsNumber extends NonNegativeIntegerVO<typeof ViewsNumberSymbol>{}
declare const LikesNumberSymbol: unique symbol
export class LikesNumber extends NonNegativeIntegerVO<typeof LikesNumberSymbol> {}
declare const DagPointsSymbol: unique symbol
export class DagPoints extends NonNegativeIntegerVO<typeof DagPointsSymbol> {}
declare const LearnersSymbol: unique symbol
export class Learners extends NonNegativeIntegerVO<typeof LearnersSymbol> {}
declare const MastersSymbol: unique symbol
export class Masters extends NonNegativeIntegerVO<typeof MastersSymbol> {}



export class ArticleStatistic {
    constructor(
        public readonly articleId: ArticleId,
        public readonly views: ViewsNumber,
        public readonly likes: LikesNumber,
        public readonly learners: Learners,
        public readonly masters: Masters,
        public readonly dagPoints: DagPoints
    ) {}
}


export enum Order{
    ASC = "ASC",
    DESC = "DESC"
}

export enum OrderingProp{
    views = "views",
    likes = "likes",
    learners = "learners",
    masters = "masters",
    dagPoints = "dagPoints"
}
