import { buildRule } from "../../lib/observableStoreConfig";
import { Me, MeRule } from "./private/Me";
import { NullIfUnauthorized } from "./private/NullIfUnauthorized";

export class Root{
  me: Me | null
}

export const RootRule = buildRule(
  async () => {},
  { 
    classConstructor: Root, 
    async update(target, data, resolve){
      target.me = await NullIfUnauthorized(resolve(undefined, MeRule))
    }
  }
)