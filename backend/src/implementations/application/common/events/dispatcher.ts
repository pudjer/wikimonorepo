import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../../../../domain/common/events/event';
import { IDomainEventDispatcher } from '../../../../application/common/events/dispatcher';
import { IDomainEventHandler } from '../../../../application/common/events/handler';

@Injectable()
export class DomainEventDispatcherImpl implements IDomainEventDispatcher {
  private handlers = new Map<string, IDomainEventHandler[]>();

  register(handler: IDomainEventHandler): void {
    if (!this.handlers.has(handler.listensTo)) {
      this.handlers.set(handler.listensTo, []);
    }
    this.handlers.get(handler.listensTo)!.push(handler);
  }

  async dispatch(event: DomainEvent): Promise<void> {
    const eventType = event.eventType;
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      await Promise.allSettled(
        handlers.map((handler) => handler.handle(event)),
      );
    }
  }

  async dispatchMany(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.dispatch(event);
    }
  }
}

