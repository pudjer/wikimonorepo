import { Integer, Record, Transaction } from "neo4j-driver";
import {
  SessionFactory,
  SessionType,
  Timestamp,
  DurationMs,
} from "../../../domain/session/entity";
import { SessionId } from "../../../domain/session/props/sessionId";
import {
  SessionRepository,
  SessionNotFoundError,
} from "../../../domain/session/repository";
import { UserId } from "../../../domain/user/props/userId";
import { Inject } from "@nestjs/common";
import { NEO4J_TRANSACTION_TOKEN, SESSION_FACTORY_TOKEN } from "../../../tokens";

type FindResult = {
  id: SessionId;
  userId: UserId;
  timestamp: Integer;
  durationMs: Integer;
};

export class SessionRepositoryImpl implements SessionRepository {
  constructor(
    @Inject(NEO4J_TRANSACTION_TOKEN) private readonly tx: Transaction,
    @Inject(SESSION_FACTORY_TOKEN) private readonly sessionFactory: SessionFactory
  ) {}

  private mapRecordToSession(record: FindResult): SessionType {
    return this.sessionFactory.createExisting(
      record.id,
      record.userId,
      new Timestamp(new Date(record.timestamp.toNumber())),
      new DurationMs(record.durationMs.toNumber())
    );
  }

  async findBySessionId(sessionId: SessionId): Promise<SessionType> {
    const result = await this.tx.run<FindResult>(
      `MATCH (s:Session {id: $id})
       RETURN s.id AS id,
              s.userId AS userId,
              s.timestamp AS timestamp,
              s.durationMs AS durationMs`,
      { id: sessionId }
    );

    const record = result.records[0];
    if (!record) {
      throw new SessionNotFoundError();
    }

    return this.mapRecordToSession(record.toObject());
  }

  async create(session: SessionType): Promise<SessionType> {
    const result = await this.tx.run<FindResult>(
      `CREATE (s:Session {
        id: $id,
        userId: $userId,
        timestamp: $timestamp,
        durationMs: $durationMs
      })
      RETURN s.id AS id,
             s.userId AS userId,
             s.timestamp AS timestamp,
             s.durationMs AS durationMs`,
      {
        id: session.id,
        userId: session.userId,
        timestamp: Integer.fromNumber(session.timestamp.getTime()),
        durationMs: Integer.fromNumber(session.durationMs.value),
      }
    );

    return this.mapRecordToSession(result.records[0].toObject())

  }

  async deleteBySessionId(sessionId: SessionId): Promise<true> {
    await this.tx.run(
      `MATCH (s:Session {id: $id})
       DETACH DELETE s`,
      { id: sessionId }
    );
    return true;
  }

  async deleteByUserId(userId: UserId): Promise<true> {
    await this.tx.run(
      `MATCH (s:Session {userId: $userId})
       DETACH DELETE s`,
      { userId }
    );
    return true;
  }


}