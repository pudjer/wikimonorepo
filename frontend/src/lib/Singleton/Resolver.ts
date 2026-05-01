import { Hydrate, Hydrator } from "./Hydrator";
import { IdentityStore } from "./Singleton";

// ========== Типы (без изменений) ==========
export type BaseRule<T> = {
  matchKey(key: string): boolean;
  allocate(key: string): T;
};

export type BuildRule<T extends object> = BaseRule<T> & {
  update(
    target: T,
    key: string,
    resolve: ResolverFn<object>,
  ): Promise<void>;
};


export type ResolverFn<T extends object> = (key: string) => Promise<T>;

export type ResolveRule<T extends object = object> = BuildRule<T>

export interface IResolver {
  refreshOutside: <T extends object>(key: string) => Promise<T>;
  addRule: (rule: ResolveRule) => void;
  resolveOutside: <T extends object>(key: string) => Promise<T>;
}


// ========== Контекст одного внешнего вызова ==========
class ResolveContext {
  constructor(
    private readonly allocator: IdentityStore,
    private readonly hydrate: Hydrate<object, unknown>,
    private readonly rules: ResolveRule[]
  ) {}

  async resolve<T extends object>(key: string): Promise<T> {
    const rule = this.findRule<T>(key);
    if (!rule) {
      throw new Error(`No rule found for key: ${key}`);
    }

    const target = this.getOrCreate(key, rule);
    // Запускаем гидратацию: при необходимости очищаем и строим заново
    await this.hydrate(target, key, async (t: T, k: string) => {
      await rule.update(
        t,
        k,
        this.resolve.bind(this),      // тот же контекст разрешения
      );
    });
    return target;

  }

  // Вспомогательный метод: достать из кэша или создать через правило
  private getOrCreate<T extends object>(key: string, rule: BaseRule<T>): T {
    let obj = this.allocator.get<T>(key);
    if (!obj) {
      obj = rule.allocate(key);
      this.allocator.set(key, obj);
    }
    return obj;
  }

  private findRule<T extends object>(key: string): ResolveRule<T> | undefined {
    return this.rules.find((rule) => rule.matchKey(key)) as ResolveRule<T>;
  }
}

// ========== Публичный Resolver ==========
export class Resolver implements IResolver {
  private readonly rules: ResolveRule[] = [];

  constructor(
    private readonly allocator: IdentityStore,
    private readonly hydrator: Hydrator
  ) {}

  addRule(rule: ResolveRule) {
    this.rules.push(rule);
  }

  async refreshOutside<T extends object>(key: string) {
    const target = this.allocator.get<T>(key);
    if (target) {
      this.hydrator.invalidate(target);
    }
    return this.resolveOutside<T>(key);
  }

  async resolveOutside<T extends object>(key: string): Promise<T> {
    // Каждый внешний вызов получает СВОЙ hydrator unit
    const hydrate = this.hydrator.getHydratorUnit();
    const context = new ResolveContext(this.allocator, hydrate, this.rules);
    return context.resolve<T>(key);
  }
}