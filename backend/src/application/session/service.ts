import { Injectable, Inject } from '@nestjs/common';
import { UserId } from "../../domain/user/props/userId";
import { SessionRepository } from "../../domain/session/repository";
import { SessionId } from "../../domain/session/props/sessionId";
import { DurationMs, SessionFactory } from "../../domain/session/entity";
import { SESSION_ACTIVE_TIME_MS_TOKEN, SESSION_FACTORY_TOKEN, SESSION_REPOSITORY_TOKEN } from '../../tokens';



export interface ISessionService{
    validateSessionAndGetUserId(sessionId: SessionId): Promise<UserId>
    refresh(sessionId: SessionId): Promise<SessionId>
    endSession(sessionId: SessionId): Promise<true>
    endUsersSessions(sessionId: SessionId): Promise<true>
}
@Injectable()
export class SessionService implements ISessionService{
    
    constructor(
        @Inject(SESSION_ACTIVE_TIME_MS_TOKEN) private readonly sessionActiveTime: DurationMs,
        @Inject(SESSION_FACTORY_TOKEN) private readonly sessionFactory: SessionFactory,
        @Inject(SESSION_REPOSITORY_TOKEN) private readonly sessionRepository: SessionRepository
    ) {}
    async validateSessionAndGetUserId(sessionId: SessionId): Promise<UserId> {
        const s = await this.sessionRepository.findBySessionId(sessionId)
        return s.userId
    }
    private async createNewSession(userId: UserId): Promise<SessionId> {
        const session = await this.sessionFactory.createNew(userId, this.sessionActiveTime)
        const s = await this.sessionRepository.create(session)
        return s.id
    } 
    async refresh(sessionId: SessionId): Promise<SessionId> {
        const oldSession = await this.sessionRepository.findBySessionId(sessionId)
        const newSessionId = await this.createNewSession(oldSession.userId)
        return newSessionId
    } 
    async endSession(sessionId: SessionId): Promise<true> {
        const session = await this.sessionRepository.findBySessionId(sessionId)
        await this.sessionRepository.deleteBySessionId(session.id)
        return true as true
    } 
    async endUsersSessions(sessionId: SessionId): Promise<true> {
        const session = await this.sessionRepository.findBySessionId(sessionId)
        await this.sessionRepository.deleteByUserId(session.userId)
        return true as true
    }


}