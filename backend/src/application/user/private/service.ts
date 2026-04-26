import { Injectable, Inject } from "@nestjs/common";
import { UserId } from "../../../domain/user/props/userId";
import { UserRepository } from "../../../domain/user/repository";
import { USER_REPOSITORY_TOKEN } from "../../../tokens";
import { UpdateUserInputPrivate, UserOutputPrivate } from "./DTO";

export interface IUserServicePrivate {
    update(input: UpdateUserInputPrivate, userId: UserId): Promise<UserOutputPrivate>
    get(id: UserId): Promise<UserOutputPrivate>
}
@Injectable()
export class UserServicePrivate implements IUserServicePrivate {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepository
    ) {}
    async update(input: UpdateUserInputPrivate, userId: UserId): Promise<UserOutputPrivate> {
        const user = await this.userRepository.findById(userId)
        input.password && await user.updatePassword(input.password)
        input.username && user.updateUsername(input.username)
        const userUpdated = await this.userRepository.update(user)
        const res = {
            id: userUpdated.id,
            username: userUpdated.username,
        }
        return res
    }
    async get(id: UserId): Promise<UserOutputPrivate> {
        const user = await this.userRepository.findById(id)
        const res = {
            id: user.id,
            username: user.username,
        }
        return res
    }
}