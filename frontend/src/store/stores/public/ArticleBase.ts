import { resolveOutside } from "../../../lib/observableStoreConfig";
import { Author, AuthorRule } from "./Author";

export class ArticleBase{
  id: string;
  authorId: string;
  title: string;
  async getAuthor(): Promise<Author> {
    return await resolveOutside(this.authorId, AuthorRule);
  }
}