import { Injectable, Inject } from '@nestjs/common';
import { UserFactory } from '../../../domain/user/entity';
import { UserId } from '../../../domain/user/props/userId';
import { UserRepository } from '../../../domain/user/repository';
import { BaseRole } from '../../../domain/user/roles';
import { USER_FACTORY_TOKEN, USER_REPOSITORY_TOKEN } from '../../../tokens';
import { RegisterUserInputPublic, UserOutputPublic } from './DTO';
import { Password } from '../../../domain/user/props/password';
import { Username } from '../../../domain/user/props/username';


export interface IUserServicePublic {
    register(input: RegisterUserInputPublic): Promise<UserOutputPublic>;
    get(id: UserId): Promise<UserOutputPublic>;
    login(username: Username, password: Password): Promise<UserId>
}

@Injectable()
export class UserServicePublic implements IUserServicePublic {
    
    constructor(
        @Inject(USER_FACTORY_TOKEN) private readonly userFactory: UserFactory,
        @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepository
    ) {}
    async get(id: UserId): Promise<UserOutputPublic> {
        const user = await this.userRepository.findById(id)
        return {
            id: user.id,
            username: user.username
        }
    }
    async register(input: RegisterUserInputPublic): Promise<UserOutputPublic> {
        const user = await this.userFactory.createNew(input.username, input.password, new BaseRole())
        const userCreated = await this.userRepository.create(user)
        const res = {
            id: userCreated.id,
            username: userCreated.username,
        }
        return res
    }
    async login(username: Username, password: Password): Promise<UserId> {
        const user = await this.userRepository.findByUserName(username)
        await user.assertPasswordIsValid(password)
        return user.id
    }
}