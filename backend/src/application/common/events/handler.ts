import { AppError } from "../../../domain/common/domainErrors";
import { DomainEvent } from "../../../domain/common/events/event";

export interface IDomainEventHandler<TEvent extends DomainEvent = DomainEvent> {
  readonly listensTo: string; 
  handle(event: TEvent): Promise<void>;
}

export class InappropriateEventError extends AppError{}