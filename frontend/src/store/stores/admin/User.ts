import { RoleName } from "backend/src/domain/user/roles"
import api from "../../../api"
import { buildRule, resolveOutside } from "../../../lib/observableStoreConfig"
import { Author, AuthorRule } from "../public/Author"

export class UserForAdmin {
  id: string
  username: string
  role: RoleName
  async getAuthor(): Promise<Author> {
    return resolveOutside(this.id, AuthorRule)
  }
}

export const UserForAdminRule = buildRule(
  async (key: string) => {
    return await api.admin.user.get(key)
  },
  {classConstructor: UserForAdmin}
)