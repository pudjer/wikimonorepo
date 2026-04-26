


export class AppError extends Error {
    constructor(message?: string) {
        super(message || new.target.name + ": app error"); // или this.constructor.name
        this.name = this.constructor.name; // корректно выставляем имя ошибки
    }
}

export class NotFoundError extends AppError {
    constructor(message?: string) {
        super(message || new.target.name + ": not found error"); // или this.constructor.name
        this.name = this.constructor.name; // корректно выставляем имя ошибки
    }
}
export class UniqueError extends AppError {
    constructor(message?: string) {
        super(message || new.target.name + ": unique error"); // или this.constructor.name
        this.name = this.constructor.name; // корректно выставляем имя ошибки
    }
}

export class AuthorityError extends AppError {
    constructor(message?: string) {
        super(message || new.target.name + ": authority error"); // или this.constructor.name
        this.name = this.constructor.name; // корректно выставляем имя ошибки
    }
}

export class LinksCycleError<T> extends AppError {
    constructor(
      public readonly linksThatCauseCycle: T[]
    ) {
      super();
    }
  }

export class BadValueError extends AppError {
    constructor(message?: string) {
        super(message || new.target.name + ": value error"); // или this.constructor.name
        this.name = this.constructor.name; // корректно выставляем имя ошибки
    }
}
