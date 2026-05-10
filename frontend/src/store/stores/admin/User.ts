import { RoleName } from "backend/src/domain/user/roles"
import queryApi from "../../../api/queryApi"
import { f } from "../../../lib"

export class UserForAdmin {
  id: string
  username: string
  role: RoleName
}

export const UserForAdminRule = f.buildRule(
  async (key: string) => {
    return await queryApi.admin.user.get(key)
  },
  {classConstructor: UserForAdmin}
)