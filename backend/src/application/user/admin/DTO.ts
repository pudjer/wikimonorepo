import { Password } from "../../../domain/user/props/password"
import { UserId } from "../../../domain/user/props/userId"
import { Username } from "../../../domain/user/props/username"
import { Role } from "../../../domain/user/roles"


export interface RegisterUserInputAdmin{
    username: Username,
    password: Password,
    role: Role
}

export interface UpdateUserInputAdmin{
    username?: Username,
    password?: Password,
    role?: Role
}

export interface UserOutputAdmin{
    id: UserId,
    username: Username,
    role: Role
}

