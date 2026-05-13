import queryApi from "../../api/queryApi";
import { f } from "../../lib";
import { checkIsAdmin } from "./private/MeBuild/CheckIsAdmin";
import { UndefinedIfUnauthorized } from "./private/UndefinedIfUnauthorized";

export class Root{
  myId: string | undefined
  isAdmin: boolean
}

export const RootRule = f.buildRule(
  async (tru: true) => {},
  { 
    classConstructor: Root, 
    async update(target){
      target.myId = await UndefinedIfUnauthorized(queryApi.private.user.get().then(res => res.id))
      target.isAdmin = !!target.myId && await checkIsAdmin(target.myId)
    }
  }
)