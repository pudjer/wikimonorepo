import queryApi from "../../../api/queryApi";
import { f } from "../../../lib";

export class Author {
  id: string;
  username: string;
}

export const AuthorRule = f.buildRule(
  async (id: string) => await queryApi.public.user.getById(id),
  { classConstructor: Author }
)
