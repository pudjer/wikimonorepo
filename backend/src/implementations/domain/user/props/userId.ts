import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { UserIdValidator, UserId, BadUserIdError, UserIdFactory } from '../../../../domain/user/props/userId';


const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class UserIdValidatorImpl implements UserIdValidator {


  async validate(raw: string): Promise<UserId> {
    if (typeof raw !== 'string' || !UUID_V4_REGEX.test(raw)) {
      throw new BadUserIdError(`Invalid UserId format: ${raw}`);
    }
    return raw as UserId;
  }
}
@Injectable()
export class UserIdFactoryImpl implements UserIdFactory {
  async createNew(): Promise<UserId> {
    return crypto.randomUUID() as UserId;
  }
}