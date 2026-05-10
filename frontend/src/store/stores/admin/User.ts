import { RoleName } from "backend/src/domain/user/roles"
import api from "../../../api"
import { Author, AuthorRule } from "../public/Author"
import { f } from "../../../lib"

export class UserForAdmin {
  id: string
  username: string
  role: RoleName
  async getAuthor(): Promise<Author> {
    return await AuthorRule.resolveOutside(this.id)
  }
}

export const UserForAdminRule = f.buildRule(
  async (key: string) => {
    return await api.admin.user.get(key)
  },
  {classConstructor: UserForAdmin}
)