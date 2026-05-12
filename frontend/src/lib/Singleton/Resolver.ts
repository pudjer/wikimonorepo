import { Hydrate, Hydrator } from "./Hydrator";
import { RWeakMap } from "./RWeakMap";


type BuildProps<D, KEY> = {
  data: D,
  key: KEY,
  resolveContainer: Resolve
}

export interface BuildRule<T extends object, D, KEY>{
  allocateContainerObject(key: KEY): T;
  fetchData(key: KEY): Promise<D>;
  buildDonor(
    data: D,
    resolveContainer: Resolve,
    key: KEY,
  ): T;
  update(container: T, buildedDonor: T): void
};


class RuleWrapper<T extends object, D, KEY>{
  private store = new RWeakMap<KEY, T>()
  constructor(
    private readonly rule: BuildRule<T, D, KEY>,
    private readonly resolve: Resolve
  ){}

  buildUpdate(key: KEY, data: D): T {
    const container = this.getContainer(key)
    const donor = this.rule.buildDonor(data, this.resolve, key)
    this.rule.update(container, donor)
    return container
  }


  fetchBuildUpdate(key: KEY): { T, }

  getContainer(key: KEY): T {
    const ready = this.store.get(key)
    if(ready) return ready

    const container = this.rule.allocateContainerObject(key)
    this.store.set(key, container)
    return container
  }
}


export type Resolve = <T extends object, D, KEY>(
  key: KEY,
  rule: BuildRule<T, D, KEY>,
  data?: D
) => undefined extends D ? (T | undefined) : T;


export type ClientFn = <T extends object, D, KEY>(key: KEY, rule: BuildRule<T, D, KEY>, data?: D) => Promise<T>;




export type PerRuleIdentity<T extends object, D, KEY> = WeakMap<BuildRule<T, D, KEY>, RWeakMap<T, KEY>>;

export class Resolver {

  private readonly perRuleIdentity: PerRuleIdentity<object, unknown, unknown> = new WeakMap();
  private readonly hydrator: Hydrator = new Hydrator();

  resolveOutside: ClientFn = async (key, rule, data?) => {
    // Каждый внешний вызов получает СВОЙ hydrator unit
    const hydrate = this.hydrator.getHydratorUnit();
    const context = new ResolveContext(hydrate, this.perRuleIdentity, this.invalidate);
    return context.resolve(key, rule, data);
  }

  invalidate = (target: object): void => {
    this.hydrator.invalidate(target);
  }

  refresh: ClientFn = async (key, rule, data?) => {
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
      const d = data || (await rule.fetchData(k));
      await rule.buildDonor(
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
      const d = data || (await rule.fetchData(k));
      await rule.buildDonor(
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
      identity = new RWeakMap<T, KEY>();
      this.perRuleIdentity.set(rule, identity);
    }
    let target = identity.get(key);
    if(!target) {
      target = rule.allocateContainerObject(key);
      identity.set(key, target);
    }
    return target;
  }

}
