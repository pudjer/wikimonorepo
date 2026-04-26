import { Injectable, Inject } from "@nestjs/common"
import { DurationMs, SessionFactory } from "../../domain/session/entity"
import { SessionId } from "../../domain/session/props/sessionId"
import { SessionRepository } from "../../domain/session/repository"
import { UserId } from "../../domain/user/props/userId"
import { SESSION_ACTIVE_TIME_MS_TOKEN, SESSION_FACTORY_TOKEN, SESSION_REPOSITORY_TOKEN } from "../../tokens"

export interface ISessionServiceLogin{
    createNewSession(userId: UserId): Promise<SessionId>
}
@Injectable()
export class SessionServiceLogin implements ISessionServiceLogin{
    
    constructor(
        @Inject(SESSION_ACTIVE_TIME_MS_TOKEN) private readonly sessionActiveTime: DurationMs,
        @Inject(SESSION_FACTORY_TOKEN) private readonly sessionFactory: SessionFactory,
        @Inject(SESSION_REPOSITORY_TOKEN) private readonly sessionRepository: SessionRepository
    ) {}
    async createNewSession(userId: UserId): Promise<SessionId> {
        const session = await this.sessionFactory.createNew(userId, this.sessionActiveTime)
        const s = await this.sessionRepository.create(session)
        return s.id
    } 
}