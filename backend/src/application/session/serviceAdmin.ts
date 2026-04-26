import { Injectable, Inject } from "@nestjs/common"
import { SessionRepository } from "../../domain/session/repository"
import { UserId } from "../../domain/user/props/userId"
import { SESSION_REPOSITORY_TOKEN } from "../../tokens"

export interface ISessionServiceAdmin{
    endUsersSessionsAdmin(userId: UserId): Promise<true>
}
@Injectable()
export class SessionServiceAdmin implements ISessionServiceAdmin{
    
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN) private readonly sessionRepository: SessionRepository
    ) {}
    async endUsersSessionsAdmin(userId: UserId): Promise<true> {
        await this.sessionRepository.deleteByUserId(userId)
        return true as true
    }
}