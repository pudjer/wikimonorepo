import { Inject, Injectable } from "@nestjs/common";
import { SESSION_SERVICE_LOGIN_TOKEN, USER_SERVICE_PUBLIC_TOKEN, } from "../tokens";
import { Password } from "../domain/user/props/password";
import { Username } from "../domain/user/props/username";
import { SessionId } from "../domain/session/props/sessionId";
import { IUserServicePublic } from "./user/public/service";
import { ISessionServiceLogin } from "./session/serviceLogin";


export interface ILoginUseCase {
    login(username: Username, password: Password): Promise<SessionId>
}

@Injectable()
export class LoginUseCase implements ILoginUseCase {
    constructor(
        @Inject(USER_SERVICE_PUBLIC_TOKEN) private readonly userService: IUserServicePublic,
        @Inject(SESSION_SERVICE_LOGIN_TOKEN) private readonly sessionService: ISessionServiceLogin
    ){}
    async login(username: Username, password: Password): Promise<SessionId> {
        const userId = await this.userService.login(username, password)
        return await this.sessionService.createNewSession(userId)
    }
}