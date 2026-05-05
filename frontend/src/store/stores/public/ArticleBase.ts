import { AxiosError } from "axios";
import { resolveOutside } from "../../../lib/observableStoreConfig";
import { TotalInteractions, TotalInteractionsRule } from "../private/TotalInteractions";
import { Author, AuthorRule } from "./Author";

export class ArticleBase{
  id: string;
  authorId: string;
  title: string;
  async getAuthor(): Promise<Author> {
    return await resolveOutside(this.authorId, AuthorRule);
  }
  async getInteractions(): Promise<TotalInteractions | null> {
    try {
      return await resolveOutside(this.id, TotalInteractionsRule);
    } catch (e) {
      if (e instanceof AxiosError && e.message === "401") {
        return null;
      }
      throw e;
    }
  }
}