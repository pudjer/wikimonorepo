import { Autorun } from "./observableProxy/autorun/autorun";
import { Resolver } from "./Singleton/Resolver";
import { Facade } from "./store/facade";

export const autorun = new Autorun();
export const resolver = new Resolver();
export const f = new Facade(autorun, resolver);

