import { UniqueError } from "../common/domainErrors";

export interface Equatable<T> {
    equals(other: T): boolean
}

export class UniqueCollection<T extends Equatable<T>> extends Object {
  private _values: T[] = [];

  constructor(values: Iterable<T>) {
    super();
    for (const value of values) {
      this.add(value);
    }
  }

  private contains(value: T): boolean {
    return this._values.some(l => l.equals(value));
  }

  add(value: T): void {
    if (this.contains(value)) {
      throw new UniqueError(this.constructor.name);
    }

    this._values.push(value);
  }

  remove(value: T): void {
    this._values = this._values.filter(l => !l.equals(value));
  }

  get values(): ReadonlyArray<T> {
    return this._values;
  }
}