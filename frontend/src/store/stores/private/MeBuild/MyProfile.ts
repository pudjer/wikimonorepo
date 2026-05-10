import queryApi from "../../../../api/queryApi";
import { f } from "../../../../lib";

export class MyProfile {
  id: string
  username: string
}


export const MyProfileRule = f.buildRule(
  async () => await queryApi.private.user.get(),
  { classConstructor: MyProfile }
)