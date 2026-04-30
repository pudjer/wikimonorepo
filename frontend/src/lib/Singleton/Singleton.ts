export type UniqueKey = string


export interface IdentityStore {
	get<CONC extends object>(key: UniqueKey): CONC | undefined
	set(key: UniqueKey, value: object): void
	has(key: UniqueKey): boolean
}
export class IdentityStoreImpl implements IdentityStore {
	private store = new Map<UniqueKey, WeakRef<object>>()

	private registry = new FinalizationRegistry<UniqueKey>((key) => {
		if (this.get(key)) return
		this.store.delete(key)
	})
	get<CONC extends object>(key: UniqueKey): CONC | undefined {
		return this.store.get(key)?.deref() as CONC
	}
	set(key: UniqueKey, value: object): void {
		if (this.get(key)) throw new UniqueKeyError()
		const ref = new WeakRef(value)
		this.store.set(key, ref)
		this.registry.register(value, key)
	}
	has(key: UniqueKey): boolean {
		return this.store.has(key)
	}
}

export class UniqueKeyError extends Error {}