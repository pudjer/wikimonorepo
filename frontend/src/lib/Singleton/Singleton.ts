


export class IdentityStore<CONC extends object, KEY> {
	private store = new Map<KEY, WeakRef<CONC>>()

	private registry = new FinalizationRegistry<KEY>((key) => {
		if (this.get(key)) return
		this.store.delete(key)
	})
	get = (key: KEY): CONC | undefined => {
		return this.store.get(key)?.deref() as CONC
	}
	set = (key: KEY, value: CONC): void => {
		if (this.get(key)) throw new UniqueKeyError()
		const ref = new WeakRef(value)
		this.store.set(key, ref)
		this.registry.register(value, key)
	}
}

export class UniqueKeyError extends Error {}