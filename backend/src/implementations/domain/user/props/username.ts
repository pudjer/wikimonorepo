import { Injectable } from '@nestjs/common';
import { UsernameValidator, BadUsernameError, Username } from '../../../../domain/user/props/username';


const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,32}$/i;

@Injectable()
export class UsernameValidatorImpl implements UsernameValidator {
  async validate(un: string): Promise<Username> {
    const trimmed = un.trim();
    if (typeof trimmed !== 'string' || trimmed.length === 0 || !USERNAME_REGEX.test(trimmed)) {
      throw new BadUsernameError(`Invalid username: ${un}. Must be 3-32 alphanumeric, _, -.`);
    }
    return trimmed as Username;
  }
}
