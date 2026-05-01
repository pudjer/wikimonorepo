import { ObservableProxy, type Callback } from "./observableProxy"

export type Constructor<T extends object> = new (...args: unknown[]) => T
export type ClassDecorator<T extends object> = <C extends Constructor<T>>(cl: C) => C

export const MakeObservable = <T extends object>(onRead: Callback<T>, onChange: Callback<T> ): ClassDecorator<T> => (target) =>{
  const res = new Proxy(target, {
    construct(t, a, n){
      const res = Reflect.construct(t, a, n)
      return ObservableProxy<T>(res, onRead, onChange)
    }
  })
  return res
}

