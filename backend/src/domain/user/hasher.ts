import { BadValueError } from "../common/domainErrors";
import { Password, PasswordHash } from './props/password';


export interface Hasher {
  hash(pw: Password): Promise<PasswordHash>;
  compare(pw: Password, pwH: PasswordHash): Promise<true>;
}

export class WrongPassword extends BadValueError{}

