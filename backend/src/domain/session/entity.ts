import { UserId } from "../user/props/userId";
import { AuthorityError, AppError } from "../common/domainErrors";
import { NonNegativeIntegerVO, PastOrPresentDateVO } from "../utils/valueObjects";
import { SessionId, SessionIdFactory, SessionIdValidator } from "./props/sessionId";
import { Inject, Injectable } from "@nestjs/common";
import { SESSION_ID_FACTORY_TOKEN } from "../../tokens";

declare const TimestampSymbol: unique symbol;
export class Timestamp extends PastOrPresentDateVO<typeof TimestampSymbol>{}

declare const DurationMsSymbol: unique symbol;
export class DurationMs extends NonNegativeIntegerVO<typeof DurationMsSymbol>{ }

export type SessionType = Session
class Session {
    constructor(
      public readonly id: SessionId,
      public readonly userId: UserId,
      public readonly timestamp: Timestamp,
      public readonly durationMs: DurationMs
    ) {
      this.assertValidAt(new Date())
    }
    
    private assertValidAt(moment: Date): true {
      const now = moment.getTime()
      const iat = this.timestamp.getTime()
      const deadline = iat + this.durationMs.value
      if(iat > now){
        throw new BadSessionError()
      }
      if(deadline < now){
        throw new SessionExpiredError()
      }
      return true
    }
}

export class BadSessionError extends AppError{}
export class SessionExpiredError extends AuthorityError{}

@Injectable()
export class SessionFactory{
    constructor(
      @Inject(SESSION_ID_FACTORY_TOKEN) private readonly sessionIdFactory: SessionIdFactory
    ){}
    async createNew(userId: UserId, duration: DurationMs): Promise<SessionType> {
        const sessionId = await this.sessionIdFactory.createNew()
        return new Session(sessionId, userId, new Timestamp(new Date()), duration)
    }
    createExisting(sessionId: SessionId, userId: UserId, timestamp: Timestamp, duration: DurationMs): SessionType {
        return new Session(sessionId, userId, timestamp, duration)
    }
}