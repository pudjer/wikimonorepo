/* eslint-disable @typescript-eslint/no-unused-vars */
import { Autorun } from "../lib/observableProxy/autorun/autorun";
import { getObserverHoc } from "../lib/reactObserver/observer";
import { HydratorImpl } from "../lib/Singleton/Hydrator";
import { Resolver } from "../lib/Singleton/Resolver";
import { RuleBuilder } from "../lib/Singleton/RuleBuilder";
import { IdentityStoreImpl } from "../lib/Singleton/Singleton";


const autorun = new Autorun()
export const builder = new RuleBuilder<object>(c => autorun.registerObject(Object.create(c.prototype)));

export const resolver = new Resolver(new IdentityStoreImpl(), new HydratorImpl());

export function CompileString(strArr: string[]): string {
  return strArr.join("/");
}
export const UUIDPattern = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";


///imports
import { Author } from "./Author";
import { Article } from "./Article";

///

builder.rules.forEach((rule) => resolver.addRule(rule));
export const observer = getObserverHoc(autorun);