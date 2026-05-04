
export type Hydrate = <CONC extends object, DATA>(target: CONC, data: DATA, build: ClientFn<CONC, DATA>) => Promise<CONC>;

export type ClientFn<CONC extends object, DATA> = (target: CONC, data: DATA, hydrate: Hydrate) => Promise<unknown>


export class  Hydrator {
  private cache = new WeakMap<object, Promise<object>>();

  getHydratorUnit = (): Hydrate => {
    const ctx = new Set<object>();
  
    const hydrate: Hydrate = async (target, data, fn) => {
      if (ctx.has(target)) return target;
      ctx.add(target);
  
      const flying = this.cache.get(target);
      if (flying) return flying as Promise<typeof target>;
  
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
  
    return hydrate;
  }

  invalidate = (target: object): void => {
    this.cache.delete(target);
  }
}
