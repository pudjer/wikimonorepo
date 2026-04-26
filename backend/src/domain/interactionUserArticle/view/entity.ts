import { ArticleId } from "../../article/props/articleId";
import { UserId } from "../../user/props/userId";
import { PastOrPresentDateVO } from "../../utils/valueObjects";

declare const TimestampSymbol: unique symbol
export class Timestamp extends PastOrPresentDateVO<typeof TimestampSymbol>{}


export class View{
    constructor(
        public readonly articleId: ArticleId,
        public readonly userId: UserId,
        public readonly timestamp: Timestamp,

    ){}
    static createNew(articleId: ArticleId, userId: UserId): View {
        return new View(articleId, userId, new Timestamp(new Date()))
    }
}

