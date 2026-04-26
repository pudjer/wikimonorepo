import { CreatedAt } from "../article/entity";
import { ArticleId } from "../article/props/articleId";
import { Title } from "../article/props/title";
import { UserId } from "../user/props/userId";
import { NonNegativeIntegerVO } from "../utils/valueObjects";
import { QueryText } from "./props/query";

declare const RelevanceScoreSymbol: unique symbol
export type RelevanceScore = number & { [RelevanceScoreSymbol]: typeof RelevanceScoreSymbol }
declare const ContentSnippetSymbol: unique symbol
export type ContentSnippet = string & { [ContentSnippetSymbol]: typeof ContentSnippetSymbol }
export class ArticleSearchResult {
  constructor(
    public readonly id: ArticleId,
    public readonly title: Title,
    public readonly contentSnippet: ContentSnippet,
    public readonly authorId: UserId,
    public readonly relevanceScore: RelevanceScore,
  ) {}
}

declare const LimitSymbol: unique symbol
export class Limit extends NonNegativeIntegerVO<typeof LimitSymbol>{}
declare const OffsetSymbol: unique symbol
export class Offset extends NonNegativeIntegerVO<typeof OffsetSymbol>{}

export class ArticleSearchQuery{
    constructor(
        public readonly queryText: QueryText,
        public readonly limit: Limit,
        public readonly offset: Offset
    ){}
}
