import { f } from "../../lib";
import { Me, MeRule } from "./private/Me";
import { NullIfUnauthorized } from "./private/NullIfUnauthorized";

export class Root{
  me: Me | null
}

export const RootRule = f.buildRule(
  async () => {},
  { 
    classConstructor: Root, 
    async update(target, data, resolve){
      target.me = await NullIfUnauthorized(MeRule.resolveInside(resolve, undefined));
    }
  }
)