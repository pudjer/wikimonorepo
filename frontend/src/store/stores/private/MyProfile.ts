import api from "../../../api";
import { buildRule } from "../../../lib/observableStoreConfig";

export class MyProfile {
  id: string
  username: string
}


export const MyProfileRule = buildRule(
  async () => await api.private.user.get(),
  { classConstructor: MyProfile }
)