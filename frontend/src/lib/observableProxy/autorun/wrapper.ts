type SomeFunc = (...args: unknown[]) => unknown
export class Wrapper{
    private reaction: SomeFunc | undefined

    public getCurrentReaction(): SomeFunc | undefined {
        return this.reaction
    }

    public wrap<T extends SomeFunc>(func: T, reaction?: () => void): T {
        const wrapped = ((...args: Parameters<T>): ReturnType<T> => {
            const prev = this.reaction
            this.reaction = reaction ?? wrapped
    
            try {
                return func(...args) as ReturnType<T>
            } finally {
                this.reaction = prev
            }
        }) as T
    
        return wrapped
    }
}