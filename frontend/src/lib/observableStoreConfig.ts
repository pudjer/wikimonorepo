import { Autorun } from "./observableProxy/autorun/autorun";
import { getObserverHoc } from "./reactObserver/observer";
import { BuildRule, Resolver, ResolverFn } from "./Singleton/Resolver";

const autorun = new Autorun()
export const observer = getObserverHoc(autorun);

const resolver = new Resolver();

export const resolveOutside = resolver.resolveOutside;
export const invalidate = resolver.invalidate;


export const allocateInstance = <T extends object>(c: new (...args: unknown[]) => T) => autorun.registerObject<T>(Object.create(c.prototype))
export const buildRule = <T extends object, D, KEY>(
  fetch: (key: KEY) => Promise<D>,
  options?: {
    classConstructor?: new (...args: unknown[]) => T,
    update?: (target: T, data: D, resolve: ResolverFn, key: KEY) => Promise<void>,
  }
): BuildRule<T, D, KEY> => {
  const allocate = options?.classConstructor ? () => allocateInstance(options.classConstructor) : () => allocateInstance(Object) as T;
  const update = options?.update ? options.update : async (target, data) => { Object.assign(target, data) };
  return {
    fetch,
    update,
    allocate
  }
}