import { UserId } from '../user/props/userId';
import { AuthorityError, NotFoundError } from '../common/domainErrors';
import { SessionType } from './entity';
import { SessionId } from './props/sessionId';

export interface SessionRepository {
  findBySessionId(sessionId: SessionId): Promise<SessionType>;
  create(session: SessionType): Promise<SessionType>;
  deleteBySessionId(session: SessionId): Promise<true>
  deleteByUserId(userId: UserId): Promise<true>
}

export class SessionNotFoundError extends AuthorityError{}


