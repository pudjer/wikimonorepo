


export function SerializeKey(obj: unknown)
{
    const allKeys = new Set();
    JSON.stringify(obj, (key, value) => (allKeys.add(key), value));
    return JSON.stringify(obj, Array.from(allKeys).sort() as (string | number)[]);
}



export class IdentityStore<CONC extends object, KEY> {
	private store = new Map<string, WeakRef<CONC>>()

	private registry = new FinalizationRegistry<string>((serializedKey) => {
		if (this.store.get(serializedKey)?.deref()) return
		this.store.delete(serializedKey)
	})
	get = (key: KEY): CONC | undefined => {
		const serializedKey = SerializeKey(key)
		return this.store.get(serializedKey)?.deref() as CONC
	}
	set = (key: KEY, value: CONC): void => {
		if (this.get(key)) throw new UniqueKeyError()
		const ref = new WeakRef(value)
		const serializedKey = SerializeKey(key)
		this.store.set(serializedKey, ref)
		this.registry.register(value, serializedKey)
	}
}

export class UniqueKeyError extends Error {}