import { ResolveRule, BuildRule } from "./Resolver";

export function Allocate<T>(Ctor: new (...args: unknown[]) => T): T {
  return Object.create(Ctor.prototype);
}

export function Clear(target: object): void {
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      delete target[key];
    }
  }
}

export class RuleBuilder<T extends object> {
  public rules: ResolveRule<T>[] = [];
  constructor(
    public defaultAllocate: (Ctor: new (...args: unknown[]) => T) => T = Allocate,
    public defaultClear: (target: T) => void = Clear
  ){}
  add(rule: ResolveRule<T>): this {
    this.rules.push(rule);
    return this;
  }

  buildRule(params: {
    matchKey: (key: string) => boolean;
    allocate: (key: string) => T;
    build: BuildRule<T>["update"];
  }): this {
    return this.add({
      matchKey: params.matchKey,
      allocate: params.allocate,
      update: params.build,
    });
  }

  // ---------- упрощённые методы ----------
  buildRuleSimple<C extends T>(
    matchPattern: string,
    Ctor: new (...args: unknown[]) => C,
    build: BuildRule<C>["update"],
    options?: {
      allocate?: (key: string) => C;
      clear?: (target: C) => void;
    }
  ): this {
    const regex = new RegExp(`^${matchPattern}$`);
    const allocate = options?.allocate ?? (() => this.defaultAllocate(Ctor));
    return this.buildRule({
      matchKey: (key) => regex.test(key),
      allocate: allocate as (key: string) => T,
      build: build as BuildRule<T>["update"],
    });
  }

}