import api from "../../api";
import { buildRule, resolveOutside } from "../../lib/observableStoreConfig";
import { ArticlePreview } from "./ArticlePreview";
import { AuthorsArticlesRule } from "./AuthorsArticles";

export class Author {
  id: string;
  username: string;
  async getArticles(): Promise<ArticlePreview[]> {
    return await resolveOutside(this.id, AuthorsArticlesRule);
  }

}

export const AuthorRule = buildRule(
  async (id: string) => await api.public.user.get(id),
  { classConstructor: Author }
)
