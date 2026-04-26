import { PastOrPresentDateVO } from "../../utils/valueObjects";
declare const OccurredAtSymbol: unique symbol
export class OccurredAt extends PastOrPresentDateVO<typeof OccurredAtSymbol> {}



export class DomainEvent {
    public readonly occurredAt = new OccurredAt(new Date());
    constructor(
        public readonly eventType: string,
    ){}
}
  


