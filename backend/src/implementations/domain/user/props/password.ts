import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PasswordValidator, BadPasswordError, PasswordHash, Password } from '../../../../domain/user/props/password';
import { Hasher, WrongPassword } from '../../../../domain/user/hasher';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
@Injectable()
export class PasswordValidatorImpl implements PasswordValidator {
  async validate(pw: string): Promise<Password> {
    if (typeof pw !== 'string' || pw.length === 0 || !PASSWORD_REGEX.test(pw)) {
      throw new BadPasswordError(`Invalid password: ${pw}. Must be 8+ chars with upper, lower, digit, special (@$!%*?&).`);
    }
    return pw as Password;
  }
}


const SALT_ROUNDS = 12;

@Injectable()
export class HasherImpl implements Hasher {
  async hash(pw: Password): Promise<PasswordHash> {
    const rawHash = await bcrypt.hash(pw, SALT_ROUNDS);
    return rawHash as PasswordHash;
  }

  async compare(pw: Password, pwH: PasswordHash): Promise<true> {
    const isMatch = await bcrypt.compare(pw, pwH);
    if (!isMatch) {
      throw new WrongPassword();
    }
    return true;
  }
}