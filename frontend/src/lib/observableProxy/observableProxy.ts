export const ownKeysSymbol = Symbol()
export const protoSymbol = Symbol()
export const extensibleSymbol = Symbol()

export type ObjectsProperty<T extends object> = keyof T | typeof ownKeysSymbol | typeof protoSymbol | typeof extensibleSymbol
export type Callback<T extends object> = (obj: T, key: ObjectsProperty<T>) => void

export const ObservableProxy = <T extends object>(obj: T, onRead: Callback<T>, onChange: Callback<T>): T  => {
  let beggined = false;
  const readen = new Set<ObjectsProperty<T>>();
  const changed = new Set<ObjectsProperty<T>>();

  const deduplicate = <F extends () => unknown>(f: F): ReturnType<F> => {
    const prev = beggined;
    beggined = true;
    try{
      return f() as ReturnType<F>;
    }finally{
      beggined = prev;
      if(!beggined){
        readen.forEach(p => onRead(obj, p))
        readen.clear()
        changed.forEach(p => onChange(obj, p))
        changed.clear()
      }
    }
  }
  const addReaden = (p: ObjectsProperty<T>) => readen.add(p)
  const addChanged = (p: ObjectsProperty<T>) => changed.add(p)

  
  return new Proxy(obj, {
      defineProperty(t, p, a){
        return deduplicate(() => {
          const isArray = Array.isArray(t)
          const prevLength = isArray ? t.length : undefined
      
          const prev = Reflect.getOwnPropertyDescriptor(t, p)
          const res = Reflect.defineProperty(t, p, a)
          const cur = Reflect.getOwnPropertyDescriptor(t, p)
      
          const isChanged = IsPropChanged(prev, cur)
      
          if (isChanged) {
            addChanged(p as ObjectsProperty<T>)
            if (prev === undefined) addChanged(ownKeysSymbol)
          }
      
          if (isArray && prevLength !== t.length) {
            addChanged('length' as ObjectsProperty<T>)
          }
      
          return res
        })
      },
      deleteProperty(t, p){
        return deduplicate(()=>{
          const prev = Reflect.has(t,p)
          const res = Reflect.deleteProperty(t, p)
          const cur = Reflect.has(t,p)
          const isChanged = prev !== cur
          if(isChanged) {
            addChanged(ownKeysSymbol)
            addChanged(p as ObjectsProperty<T>)
          }
          return res
        })
      },
      getOwnPropertyDescriptor(t, p){
        return deduplicate(()=>{
          try{
            const res = Reflect.getOwnPropertyDescriptor(t,p)
            return res
          }finally{
            addReaden(p as ObjectsProperty<T>)
          }
        })
      },
      get(t, p, r){
        return deduplicate(()=>{
          try{
            const res = Reflect.get(t, p, r)
            return res
          }finally{
            addReaden(p as ObjectsProperty<T>)
          }
        })
      },
      getPrototypeOf(t){
        return deduplicate(()=>{
          try{
            const res = Reflect.getPrototypeOf(t)
            return res
          }finally{
            addReaden(protoSymbol)
          }
        })
      },
      setPrototypeOf(t, v){
        return deduplicate(()=>{
          const prev = Reflect.getPrototypeOf(t)
          const res = Reflect.setPrototypeOf(t, v)
          const cur = Reflect.getPrototypeOf(t)
          const isChanged = prev !== cur
          if(isChanged) addChanged(protoSymbol)
          return res
        })
      },
      has(t, p){
        return deduplicate(()=>{
          try{
            const res = Reflect.has(t, p)
            return res
          }finally{
            addReaden(p as ObjectsProperty<T>)
          }
        })
      },
      isExtensible(t){
        return deduplicate(()=>{
          try{
            const res = Reflect.isExtensible(t)
            return res
          }finally{
            addReaden(extensibleSymbol)
          }
        })
      },
      preventExtensions(t){
        return deduplicate(()=>{
          const prev = Reflect.isExtensible(t)
          const res = Reflect.preventExtensions(t)
          const cur = Reflect.isExtensible(t)
          const isChanged = prev !== cur
          if(isChanged) addChanged(extensibleSymbol)
          return res
        })
      },
      ownKeys(t){
        return deduplicate(()=>{
          try{
            const res = Reflect.ownKeys(t)
            return res
          }finally{
            addReaden(ownKeysSymbol)
          }
        })
      },
    }
  )
}



export const IsPropChanged = (cur: PropertyDescriptor | undefined, prev: PropertyDescriptor | undefined) => {
  if(!cur && !prev) return false
  if(!cur || !prev) return true
  return  cur.value!==prev.value ||
          cur.configurable!==prev.configurable ||
          cur.writable!==prev.writable ||
          cur.enumerable!==prev.enumerable ||
          cur.get!==prev.get ||
          cur.set!==prev.set
}