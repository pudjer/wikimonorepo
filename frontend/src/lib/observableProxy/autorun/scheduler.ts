type SomeFunction = () => unknown
export class DeduplicatorPromisifier {
    private callPromise: Promise<unknown> = Promise.resolve()
    private scheduledMap: WeakMap<SomeFunction, Promise<unknown>> = new WeakMap()

    schedule<T extends SomeFunction>(f: T): Promise<ReturnType<T>> {
        const alreadyScheduled = this.scheduledMap.get(f)
        if (alreadyScheduled) return alreadyScheduled as Promise<ReturnType<T>>
        const promise = this.callPromise.then(() => {
            const res = f()
            this.scheduledMap.delete(f)
            return res
        })
        this.scheduledMap.set(f, promise)

        return promise as Promise<ReturnType<T>>
    }
}