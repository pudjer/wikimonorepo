import { Transaction } from "neo4j-driver";
import { UserFactory, UserType } from "../../../domain/user/entity";
import { PasswordHash } from "../../../domain/user/props/password";
import { UserId } from "../../../domain/user/props/userId";
import {
  UserRepository,
  UserNotFoundError,
  UsernameUniqueError,
} from "../../../domain/user/repository";
import { Username } from "../../../domain/user/props/username";
import { NEO4J_TRANSACTION_TOKEN, USER_FACTORY_TOKEN } from "../../../tokens";
import { Inject } from "@nestjs/common";
import { Record } from "neo4j-driver";
import { Role, roleByName, RoleName } from "../../../domain/user/roles";
type FindResult = {
  id: UserId;
  username: Username;
  passwordHash: PasswordHash;
  role: RoleName;
};

export class UserRepositoryImpl implements UserRepository {
  constructor(
    @Inject(NEO4J_TRANSACTION_TOKEN) private readonly tx: Transaction,
    @Inject(USER_FACTORY_TOKEN) private readonly userFactory: UserFactory
  ) {}

  private mapRecordToUser(record: FindResult): UserType {
    return this.userFactory.createExisting(
      record.id,
      record.username,
      record.passwordHash,
      roleByName(record.role)
    );
  }

  private extractRecord(record: Record<FindResult, keyof FindResult>): FindResult {
    return record.toObject();
  }

  async findByUserName(username: Username): Promise<UserType> {
    const result = await this.tx.run<FindResult>(
      `MATCH (u:User {username: $username})
       RETURN u.id AS id, u.username AS username, u.passwordHash AS passwordHash, u.role AS role`,
      { username }
    );

    const record = result.records[0];
    if (!record) throw new UserNotFoundError();

    return this.mapRecordToUser(this.extractRecord(record));
  }

  async findById(id: UserId): Promise<UserType> {
    const result = await this.tx.run<FindResult>(
      `MATCH (u:User {id: $id})
       RETURN u.id AS id, u.username AS username, u.passwordHash AS passwordHash, u.role AS role`,
      { id }
    );

    const record = result.records[0];
    if (!record) throw new UserNotFoundError();

    return this.mapRecordToUser(this.extractRecord(record));
  }

  async create(user: UserType): Promise<UserType> {
    try {
      const result = await this.tx.run<FindResult>(
        `CREATE (u:User {
          id: $id,
          username: $username,
          passwordHash: $passwordHash,
          role: $role
        })
        RETURN u.id AS id, u.username AS username, u.passwordHash AS passwordHash, u.role AS role`,
        {
          id: user.id,
          username: user.username,
          passwordHash: user.passwordHash,
          role: user.role.name
        }
      );

      return this.mapRecordToUser(this.extractRecord(result.records[0]));
    } catch (err: unknown) {
      if (
        (err as any).code ===
        "Neo.ClientError.Schema.ConstraintValidationFailed"
      ) {
        throw new UsernameUniqueError();
      }
      throw err;
    }
  }

  async update(user: UserType): Promise<UserType> {
    try {
      const result = await this.tx.run<FindResult>(
        `MATCH (u:User {id: $id})
         SET u.username = $username,
             u.passwordHash = $passwordHash,
             u.role = $role
         RETURN u.id AS id, u.username AS username, u.passwordHash AS passwordHash, u.role AS role`,
        {
          id: user.id,
          username: user.username,
          passwordHash: user.passwordHash,
          role: user.role.name
        }
      );

      if (result.records.length === 0) {
        throw new UserNotFoundError();
      }

      return this.mapRecordToUser(this.extractRecord(result.records[0]));
    } catch (err: unknown) {
      if (
        (err as any).code ===
        "Neo.ClientError.Schema.ConstraintValidationFailed"
      ) {
        throw new UsernameUniqueError();
      }
      throw err;
    }
  }
}