import { ResolveRule, BuildRule } from "./Resolver";

export function defaultAllocate<T>(Ctor: new (...args: unknown[]) => T): T {
  return Object.create(Ctor.prototype);
}

export function defaultClear(target: object): void {
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      delete target[key];
    }
  }
}

export class RuleBuilder<T extends object> {
  public rules: ResolveRule<T>[] = [];

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

  delegatingRule(params: {
    matchKey: (key: string) => boolean;
    allocate: (key: string) => T;
    toParentKey: (key: string) => string;
  }): this {
    return this.add({
      matchKey: params.matchKey,
      allocate: params.allocate,
      toParentKey: params.toParentKey,
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
    const allocate = options?.allocate ?? (() => defaultAllocate(Ctor));
    return this.buildRule({
      matchKey: (key) => regex.test(key),
      allocate: allocate as (key: string) => T,
      build: build as BuildRule<T>["update"],
    });
  }

  delegatingRuleSimple<C extends T>(
    matchPattern: string,
    Ctor: new (...args: unknown[]) => C,
    suffixPattern: string | RegExp,  // теперь может быть строкой или RegExp
    options?: {
      allocate?: (key: string) => C;
      clear?: (target: C) => void;
    }
  ): this {
    const regex = new RegExp(`^${matchPattern}$`);
    
    // Преобразуем суффикс в RegExp, если передана строка
    const suffixRegex = typeof suffixPattern === 'string'
      ? new RegExp(`${escapeRegex(suffixPattern)}$`)  // экранируем и добавляем $
      : suffixPattern;
  
    const toParentKey = (key: string) => {
      // Проверяем, совпадает ли суффиксный паттерн с концом строки
      const match = key.match(suffixRegex);
      if (match && match.index! + match[0].length === key.length) {
        return key.slice(0, -match[0].length);
      }
      return key;
    };
  
    // Вспомогательная функция для экранирования спецсимволов в строке
    function escapeRegex(str: string): string {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    const allocate = options?.allocate ?? (() => defaultAllocate(Ctor));
    return this.delegatingRule({
      matchKey: (key) => regex.test(key),
      allocate: allocate as (key: string) => T,
      toParentKey,
    });
  }
}