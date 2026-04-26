import { UserId, UserIdFactory, UserIdValidator } from "./props/userId";
import { Password, PasswordHash } from "./props/password";
import { Hasher } from './hasher';
import { Username } from "./props/username";
import { Inject, Injectable } from "@nestjs/common";
import { HASHER_TOKEN, USER_ID_FACTORY_TOKEN } from "../../tokens";
import { Role } from "./roles";


export type UserType = User
class User {
  constructor(
    public readonly id: UserId,
    private _username: Username,
    private _passwordHash: PasswordHash,
    private _role: Role,
    private readonly hasher: Hasher,
  ) {}

  public get role(): Role {
    return this._role
  }
  public updateRole(newRole: Role): void{
      this._role = newRole
  }
  public updateUsername(newUsername: Username): void{
      this._username = newUsername;
  }
  public get username(): Username{
      return this._username;
  }
  public get passwordHash(): PasswordHash{
      return this._passwordHash;
  }

  async assertPasswordIsValid(pw: Password): Promise<true> {
    await this.hasher.compare(pw, this.passwordHash)
    return true
  }

  async updatePassword(pw: Password): Promise<true> {
    const pwH = await this.hasher.hash(pw)
    this._passwordHash = pwH
    return true
  }
}


@Injectable()
export class UserFactory{
  constructor(
    @Inject(HASHER_TOKEN) private readonly hasher: Hasher,
    @Inject(USER_ID_FACTORY_TOKEN) private readonly idFactory: UserIdFactory
  ){}

  async createNew(userName: Username, password: Password, role: Role): Promise<UserType> {
    const pwH = await this.hasher.hash(password)
    const id = await this.idFactory.createNew()
    return new User(id, userName, pwH, role, this.hasher)
  }
  createExisting(id: UserId, userName: Username, passwordHash: PasswordHash, role: Role): UserType {
    return new User(id, userName, passwordHash, role,this.hasher)
  }


}



