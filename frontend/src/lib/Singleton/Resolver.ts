import { Hydrate, Hydrator } from "./Hydrator";
import { IdentityStore } from "./Singleton";

// ========== Типы (без изменений) ==========

export type BuildRule<T extends object, D, KEY> = {
  allocate(key: KEY): T;
  fetch(key: KEY): Promise<D>;
  update(
    target: T,
    data: D,
    innerResolve: ResolverFn,
    key: KEY,
  ): Promise<void>;
};


export type ResolverFn = <T extends object, D, KEY>(key: KEY, rule: BuildRule<T, D, KEY>, data?: D) => Promise<T>;




export type PerRuleIdentity<T extends object, D, KEY> = WeakMap<BuildRule<T, D, KEY>, IdentityStore<T, KEY>>;

export class Resolver {

  private readonly perRuleIdentity: PerRuleIdentity<object, unknown, unknown> = new WeakMap();
  private readonly hydrator: Hydrator = new Hydrator();

  resolveOutside: ResolverFn = async (key, rule, data?) => {
    // Каждый внешний вызов получает СВОЙ hydrator unit
    const hydrate = this.hydrator.getHydratorUnit();
    const context = new ResolveContext(hydrate, this.perRuleIdentity, this.invalidate);
    return context.resolve(key, rule, data);
  }

  invalidate = (target: object): void => {
    this.hydrator.invalidate(target);
  }

  refresh: ResolverFn = async (key, rule, data?) => {
    const hydrate = this.hydrator.getHydratorUnit();
    const context = new ResolveContext(hydrate, this.perRuleIdentity, this.invalidate);
    return context.refresh(key, rule, data);
  }
}

// ========== Контекст одного внешнего вызова ==========
class ResolveContext {
  private readonly alreadyInvalidated = new WeakSet<object>();
  constructor(
    private readonly hydrate: Hydrate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly perRuleIdentity: PerRuleIdentity<any, any, any>,
    private readonly invalidate: (target: object) => void
  ) {}

  resolve = async <T extends object, D, KEY>(key: KEY, rule: BuildRule<T, D, KEY>, data?: D): Promise<T> => {
    const target = this.getOrAllocate<T, D, KEY>(key, rule);

    await this.hydrate(target, key, async (t: typeof target, k: typeof key) => {
      const d = data || (await rule.fetch(k));
      await rule.update(
        t,
        d,
        this.resolve,
        k,
      );
    });
    return target;

  }
  
  refresh = async <T extends object, D, KEY>(key: KEY, rule: BuildRule<T, D, KEY>, data?: D): Promise<T> => {
    const target = this.getOrAllocate<T, D, KEY>(key, rule);
    if(!this.alreadyInvalidated.has(target)) {
      this.invalidate(target);
      this.alreadyInvalidated.add(target);
    }
    await this.hydrate(target, key, async (t: typeof target, k: typeof key) => {
      const d = data || (await rule.fetch(k));
      await rule.update(
        t,
        d,
        this.refresh,
        k,
      );
    });
    return target;
  }

  private getOrAllocate = <T extends object, D, KEY>(key: KEY, rule: BuildRule<T, D, KEY>): T => {
    let identity = this.perRuleIdentity.get(rule);
    if(!identity) {
      identity = new IdentityStore<T, KEY>();
      this.perRuleIdentity.set(rule, identity);
    }
    let target = identity.get(key);
    if(!target) {
      target = rule.allocate(key);
      identity.set(key, target);
    }
    return target;
  }

}
