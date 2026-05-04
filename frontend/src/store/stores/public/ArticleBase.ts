import { resolveOutside } from "../../../lib/observableStoreConfig";
import { Author, AuthorRule } from "./Author";

export class ArticleBase{
  id: string;
  authorId: string;
  async getAuthor(): Promise<Author> {
    return await resolveOutside(this.authorId, AuthorRule);
  }
}