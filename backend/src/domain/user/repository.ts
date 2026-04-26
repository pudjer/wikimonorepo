import { UserId } from './props/userId';
import { Username } from './props/username';
import { UserType } from './entity';
import { NotFoundError, UniqueError } from '../common/domainErrors';

export interface UserRepository {
  findByUserName(un: Username): Promise<UserType>;
  findById(id: UserId): Promise<UserType>;
  create(user: UserType): Promise<UserType>;
  update(user: UserType): Promise<UserType>;
}

export class UserNotFoundError extends NotFoundError{}

export class UsernameUniqueError extends UniqueError{}

