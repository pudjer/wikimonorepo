import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { SessionIdValidator, SessionId, BadSessionIdError, SessionIdFactory } from '../../../../domain/session/props/sessionId';


const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class SessionIdValidatorImpl implements SessionIdValidator {


  async validate(raw: string): Promise<SessionId> {
    if (typeof raw !== 'string' || !UUID_V4_REGEX.test(raw)) {
      throw new BadSessionIdError(`Invalid SessionId format: ${raw}`);
    }
    return raw as SessionId;
  }
}

export class SesssionIdFactoryImpl implements SessionIdFactory {
  async createNew(): Promise<SessionId> {
    return crypto.randomUUID() as SessionId;
  }
}