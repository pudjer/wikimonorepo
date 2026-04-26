import { BadValueError } from "../common/domainErrors";

export abstract class NonNegativeIntegerVO<T extends symbol>{
    private readonly T!: T
    constructor(public readonly value: number) {
        if (!Number.isInteger(value) || value < 0) {
            throw new BadValueError("Bad NonNegativeIntegerVO " + new.target.name)
        }
    }
    add(value: number): this {
        const Ctor = this.constructor as new (value: number) => this
        return new Ctor(this.value + value)
    }
    sub(value: number): this {
        const Ctor = this.constructor as new (value: number) => this
        return new Ctor(this.value - value)
    }
}
export abstract class NonNegativeIntegerPercentageVO<T extends symbol>{
    private readonly T!: T
    constructor(public readonly value: number) {
        if (!Number.isInteger(value) || value < 0 || value > 100) {
            throw new BadValueError("Bad NonNegativeIntegerPercentageVO " + new.target.name)
        }
    }
}

export abstract class NonNegativePercentageVO<T extends symbol>{
    private readonly T!: T
    constructor(public readonly value: number) {
        if (value < 0 || value > 100) {
            throw new BadValueError("Bad NonNegativeIntegerPercentageVO " + new.target.name)
        }
    }
}
export abstract class PastOrPresentDateVO<T extends symbol> extends Date{
    private readonly T!: T
    constructor(value: Date) {
        if (value.getTime() > Date.now()) {
            throw new BadValueError("Bad PastOrPresentDateVO " + new.target.name)
        }
        super(value)
    }
}