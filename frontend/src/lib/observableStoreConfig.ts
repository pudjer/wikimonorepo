import { Autorun } from "./observableProxy/autorun/autorun";
import { getObserverHoc } from "./reactObserver/observer";
import { BuildRule, Resolver, ResolverFn } from "./Singleton/Resolver";

export const autorun = new Autorun()
export const observer = getObserverHoc(autorun);

const resolver = new Resolver();

export const resolveOutside = resolver.resolveOutside;
export const invalidate = resolver.invalidate;


type WithoutMethods<T> = {
  [K in keyof T as T[K] extends (...args: unknown[])=> unknown ? never : K]: T[K]
}
type WithUpdate<T extends object, D, KEY> = {
  update: (target: T, data: D, resolve: ResolverFn, key: KEY) => Promise<void>;
}
export type Options<T extends object, D, KEY> = 
(
  WithoutMethods<D> extends WithoutMethods<T> ? 
    WithoutMethods<T> extends WithoutMethods<D> ? Partial<WithUpdate<T, D, KEY>> : WithUpdate<T, D, KEY>
  : WithUpdate<T, D, KEY>
)
& (
  | {
      classConstructor: new (...args: unknown[]) => T;
      allocate?: never;
    }
  | {
      allocate: (key: KEY) => T;
      classConstructor?: never;
    }
);

export const allocateInstance = <T extends object>(
  c: new (...args: unknown[]) => T
): T => autorun.registerObject<T>(Object.create(c.prototype));

export const buildRule = <T extends object, D, KEY>(
  fetch: (key: KEY) => Promise<D>,
  options: Options<T, D, KEY>
): BuildRule<T, D, KEY> => {
  const allocate = options.allocate 
    ? options.allocate 
    : options.classConstructor 
      ? () => allocateInstance(options.classConstructor) 
      : () => allocateInstance(Object) as T;
  
  const update = options?.update 
    ? options.update 
    : async (target: T, data: D) => { Object.assign(target, data) };
  
  return {
    fetch,
    update,
    allocate
  };
};