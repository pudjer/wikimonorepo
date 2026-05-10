import api from "../../../api";
import { f } from "../../../lib";

export class Author {
  id: string;
  username: string;
}

export const AuthorRule = f.buildRule(
  async (id: string) => await api.public.user.get(id),
  { classConstructor: Author }
)
