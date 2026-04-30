type Context = Set<object>

export type Hydrate<CONC extends object, DATA> = (target: CONC, data: DATA, build: ClientFn<CONC, DATA>) => Promise<CONC>;

export type ClientFn<CONC extends object, DATA> = (target: CONC, data: DATA, hydrate: Hydrate<object, unknown>) => Promise<unknown>

export interface Hydrator {
  getHydratorUnit<CONC extends object, DATA>(): Hydrate<CONC, DATA>;
  invalidate(target: object): void;
}

export class HydratorImpl implements Hydrator {
  private cache = new WeakMap<object, Promise<object>>();

  getHydratorUnit<CONC extends object, DATA>(): Hydrate<CONC, DATA> {
    const ctx: Context = new Set();
  
    const hydrate: Hydrate<object, unknown> = async (target, data, fn) => {
      if (ctx.has(target)) return target;
      ctx.add(target);
  
      const flying = this.cache.get(target);
      if (flying) return flying;
  
      const promise = Promise.resolve()
        .then(() => fn(target, data, hydrate))
        .then(() => target)
        .catch(e => {
          this.cache.delete(target)
          ctx.delete(target)
          throw e
        })
  
      this.cache.set(target, promise);
  
      return promise;
    };
  
    return hydrate as Hydrate<CONC, DATA>;
  }

  invalidate(target: object): void {
    this.cache.delete(target);
  }
}
