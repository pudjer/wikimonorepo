import queryApi from "../../api/queryApi";
import { f } from "../../lib";
import { UndefinedIfUnauthorized } from "./private/UndefinedIfUnauthorized";

export class Root{
  myId: string | undefined
}

export const RootRule = f.buildRule(
  async (tru: true) => {},
  { 
    classConstructor: Root, 
    async update(target){
      target.myId = await UndefinedIfUnauthorized(queryApi.private.user.get().then(res => res.id))
    }
  }
)