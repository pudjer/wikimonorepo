import api from "../../../api";
import { f } from "../../../lib";
import { ArticlePreview } from "./ArticlePreview";
import { AuthorsArticlesRule } from "./AuthorsArticles";

export class Author {
  id: string;
  username: string;
  async getArticles(): Promise<ArticlePreview[]> {
    return await AuthorsArticlesRule.resolveOutside(this.id)
  }

}

export const AuthorRule = f.buildRule(
  async (id: string) => await api.public.user.get(id),
  { classConstructor: Author }
)
