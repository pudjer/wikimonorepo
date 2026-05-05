import { resolveOutside } from "../../../lib/observableStoreConfig";
import { TotalInteraction, TotalInteractionsRule } from "../private/TotalInteractions";
import { Author, AuthorRule } from "./Author";
import { NullIfUnauthorized } from "../private/NullIfUnauthorized";

export class ArticleBase{
  id: string;
  authorId: string;
  title: string;
  async getAuthor(): Promise<Author> {
    return await resolveOutside(this.authorId, AuthorRule);
  }
  async getInteractions(): Promise<TotalInteraction | null> {
      return NullIfUnauthorized(resolveOutside(this.id, TotalInteractionsRule))
  }
}