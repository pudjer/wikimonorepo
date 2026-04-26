import { DomainEvent } from "../../../domain/common/events/event";
import { IDomainEventHandler } from "./handler";

export interface IDomainEventDispatcher {
  register(handler: IDomainEventHandler): void;
  dispatch(event: DomainEvent): Promise<void>;
  dispatchMany(events: DomainEvent[]): Promise<void>;
}