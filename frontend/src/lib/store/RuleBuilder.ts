import { Autorun } from "../observableProxy/autorun/autorun";
import { BuildRule, ResolverFn } from "../Singleton/Resolver";



export class RuleBuilder {

  constructor(private readonly autorun: Autorun) {}

  // Приватный метод для выделения экземпляра с регистрацией в observable store
  private allocateInstance<T extends object>(c: new (...args: unknown[]) => T): T {
    return this.autorun.registerObject(Object.create(c.prototype));
  }

  // Публичный метод, полностью заменяющий исходную функцию buildRule
  buildRule<T extends object, D, KEY>(
    fetch: (key: KEY) => Promise<D>,
    options: Options<T, D, KEY>
  ): BuildRule<T, D, KEY> {
    const allocate = options.allocate
      ? options.allocate
      : options.classConstructor
        ? () => this.allocateInstance(options.classConstructor)
        : () => this.allocateInstance(Object) as T;

    const update = options?.update
      ? options.update
      : async (target: T, data: D) => { Object.assign(target, data); };

    return {
      fetch,
      update,
      allocate
    };
  }
}

// --- Типы остаются без изменений ---

type WithoutMethods<T> = {
  [K in keyof T as T[K] extends (...args: unknown[]) => unknown ? never : K]: T[K];
};

type WithUpdate<T extends object, D, KEY> = {
  update: (target: T, data: D, resolve: ResolverFn, key: KEY) => Promise<void>;
};

export type Options<T extends object, D, KEY> =
  (WithoutMethods<D> extends WithoutMethods<T> ? WithoutMethods<T> extends WithoutMethods<D> ? Partial<WithUpdate<T, D, KEY>> : WithUpdate<T, D, KEY> : WithUpdate<T, D, KEY>) &
  ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    classConstructor: new (...args: any[]) => T;
    allocate?: never;
  } |
  {
    allocate: (key: KEY) => T;
    classConstructor?: never;
  });