import { Injectable, Inject } from "@nestjs/common";
import { UserFactory } from "../../../domain/user/entity";
import { UserId } from "../../../domain/user/props/userId";
import { UserRepository } from "../../../domain/user/repository";
import { USER_REPOSITORY_TOKEN, USER_FACTORY_TOKEN } from "../../../tokens";
import { RegisterUserInputAdmin, UpdateUserInputAdmin, UserOutputAdmin } from "./DTO";

export interface IUserServiceAdmin{
    updateByAdmin(input: UpdateUserInputAdmin, userId: UserId): Promise<UserOutputAdmin>
    registerByAdmin(input: RegisterUserInputAdmin): Promise<UserOutputAdmin>
    getByAdmin(id: UserId): Promise<UserOutputAdmin>
}

@Injectable()
export class UserServiceAdmin implements IUserServiceAdmin {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepository,
        @Inject(USER_FACTORY_TOKEN) private readonly userFactory: UserFactory,
        
    ) {}
    async updateByAdmin(input: UpdateUserInputAdmin, userId: UserId): Promise<UserOutputAdmin> {
        const user = await this.userRepository.findById(userId)
        input.password && await user.updatePassword(input.password)
        input.username && user.updateUsername(input.username)
        input.role && user.updateRole(input.role)
        const userUpdated = await this.userRepository.update(user)
        const res = {
            id: userUpdated.id,
            username: userUpdated.username,
            role: userUpdated.role
        }
        return res
    }
    async registerByAdmin(input: RegisterUserInputAdmin): Promise<UserOutputAdmin> {
        const user = await this.userFactory.createNew(input.username, input.password, input.role)
        const userCreated = await this.userRepository.create(user)
        const res = {
            id: userCreated.id,
            username: userCreated.username,
            role: userCreated.role
        }
        return res
    }
    async getByAdmin(id: UserId): Promise<UserOutputAdmin> {
        const user = await this.userRepository.findById(id)
        const res = {
            id: user.id,
            username: user.username,
            role: user.role
        }
        return res
    }
}