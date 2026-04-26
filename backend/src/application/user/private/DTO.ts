import { Password } from "../../../domain/user/props/password";
import { UserId } from "../../../domain/user/props/userId";
import { Username } from "../../../domain/user/props/username";

export interface UpdateUserInputPrivate{
    username?: Username,
    password?: Password,
}
export interface UserOutputPrivate{
    id: UserId,
    username: Username
}