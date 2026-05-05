import { buildRule } from "../../../lib/observableStoreConfig";
import { MyProfile, MyProfileRule } from "./MyProfile";
import { TotalInteractions, MyInteractionsRule } from "./TotalInteractions";

export class Me{
  profile: MyProfile
  interactions: TotalInteractions[]
}

export const MeRule = buildRule(
  async () => {},
  { 
    classConstructor: Me, 
    update: async (target, data, resolve) => {
      target.profile = await resolve(undefined, MyProfileRule);
      target.interactions = await resolve(undefined, MyInteractionsRule);
    } 
  }
)