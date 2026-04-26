export interface IValidator<R, T> {
    validate(value: R): Promise<T>;
}