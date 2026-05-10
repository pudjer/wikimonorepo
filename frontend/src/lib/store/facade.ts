import { Autorun } from "../observableProxy/autorun/autorun";
import { getObserverHoc } from "../reactObserver/observer";
import { Resolver, ResolverFn } from "../Singleton/Resolver";
import { Options, RuleBuilder } from "./RuleBuilder";
import { AsyncState, useAsync } from "./useAsync";


export interface RuleOutput<T extends object, D, KEY> {
  resolveOutside(key: KEY, data?: D): Promise<T>;
  refresh(key: KEY, data?: D): Promise<T>;
  useResolve(key: KEY, deps?: unknown[], data?: D): AsyncState<T>;
  resolveInside(resolve: ResolverFn, key: KEY, data?: D): Promise<T>;
}
export class Facade {
  private readonly ruleBuilder: RuleBuilder;
  public readonly observer: ReturnType<typeof getObserverHoc>;
  constructor(
    autorun: Autorun,
    private readonly resolver: Resolver
  ) {
    this.ruleBuilder = new RuleBuilder(autorun);
    this.observer = getObserverHoc(autorun);
  }
  buildRule = <T extends object, D, KEY>(
    fetch: (key: KEY) => Promise<D>,
    options: Options<T, D, KEY>
  ): RuleOutput<T, D, KEY> => { 
    const rule = this.ruleBuilder.buildRule(fetch, options);
    return {
      resolveOutside: async (key: KEY, data?: D) => await this.resolver.resolveOutside(key, rule, data),
      refresh: async (key: KEY, data?: D) => await this.resolver.refresh(key, rule, data),
      useResolve: (key: KEY, deps?: unknown[], data?: D) => {
        const asyncFunction = () => this.resolver.resolveOutside(key, rule, data);
        return useAsync(asyncFunction, deps || []);
      },
      resolveInside: async (resolve: ResolverFn, key: KEY, data?: D) => {
        return await resolve(key, rule, data);
      }
    };
  }
}