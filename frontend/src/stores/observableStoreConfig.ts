import { Autorun } from "../lib/observableProxy/autorun/autorun";
import { getObserverHoc } from "../lib/reactObserver/observer";
import { Resolver } from "../lib/Singleton/Resolver";

const autorun = new Autorun()
export const observer = getObserverHoc(autorun);

export const allocateInstance = (c: new (...args: unknown[]) => unknown) => autorun.registerObject(Object.create(c.prototype))
const resolver = new Resolver();

export const resolveOutside = resolver.resolveOutside.bind(resolver);
export const invalidate = resolver.invalidate.bind(resolver);


