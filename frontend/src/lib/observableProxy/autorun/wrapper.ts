type SomeFunc = (...args: unknown[]) => unknown
export class Wrapper{
    private currentFunction: SomeFunc | undefined

    public getCurrentFunction(): SomeFunc | undefined {
        return this.currentFunction
    }

    public wrap<T extends SomeFunc>(func: T): T {
        const wrapped = ((...args: Parameters<T>): ReturnType<T> => {
            const prev = this.currentFunction
            this.currentFunction = wrapped
    
            try {
                return func(...args) as ReturnType<T>
            } finally {
                this.currentFunction = prev
            }
        }) as T
    
        return wrapped
    }
}