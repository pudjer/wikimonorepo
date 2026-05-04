import api from "../../api";
import { buildRule, resolveOutside } from "../../lib/observableStoreConfig";
import { ArticleMinified } from "./ArticleMinified";
import { AuthorsArticlesRule } from "./AuthorsArticles";

export class Author {
  id: string;
  username: string;
  async getArticles(): Promise<ArticleMinified[]> {
    return await resolveOutside(this.id, AuthorsArticlesRule);
  }

}

export const AuthorRule = buildRule(
  async (id: string) => await api.publicUser.get(id),
  { classConstructor: Author }
)
