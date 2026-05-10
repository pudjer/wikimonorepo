import { NullIfUnauthorized } from "../private/NullIfUnauthorized";
import { TotalInteraction, TotalInteractionRule } from "../private/TotalInteractions";
import { Author, AuthorRule } from "./Author";

export class ArticleBase{
  id: string;
  authorId: string;
  title: string;
  async getAuthor(): Promise<Author> {
    return await AuthorRule.resolveOutside(this.authorId);
  }
  async getInteractions(): Promise<TotalInteraction | null> {
    return NullIfUnauthorized(TotalInteractionRule.resolveOutside(this.id))
  }
}