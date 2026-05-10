import { Hydrate, Hydrator } from "./Hydrator";
import { IdentityStore } from "./Singleton";

// ========== Типы (без изменений) ==========

export type BuildRule<T extends object, D, KEY> = {
  allocate(key: KEY): T;
  fetch(key: KEY): Promise<D>;
  update(
    target: T,
    data: D,
    resolve: ResolverFn,
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
    const context = new ResolveContext(hydrate, this.perRuleIdentity);
    return context.resolve(key, rule, data);
  }

  invalidate = (target: object): void => {
    this.hydrator.invalidate(target);
  }

  refresh: ResolverFn = async (key, rule, data?) => {
    this.invalidate(this.perRuleIdentity.get(rule)?.get(key) ?? {});
    return await this.resolveOutside(key, rule, data);
  }
}

// ========== Контекст одного внешнего вызова ==========
class ResolveContext {
  constructor(
    private readonly hydrate: Hydrate,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly perRuleIdentity: PerRuleIdentity<any, any, any>,
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
