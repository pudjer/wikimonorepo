import api from "../../../../api";
import { f } from "../../../../lib";

export class MyProfile {
  id: string
  username: string
}


export const MyProfileRule = f.buildRule(
  async () => await api.private.user.get(),
  { classConstructor: MyProfile }
)