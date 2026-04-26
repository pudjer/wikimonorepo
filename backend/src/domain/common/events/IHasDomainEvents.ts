import { DomainEvent } from "./event";


export interface IHasDomainEvents {
    GetDomainEvents(): ReadonlyArray<DomainEvent>;
    ClearDomainEvents(): void;
}
