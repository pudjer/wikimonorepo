import {
  applyDecorators,
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
    UseGuards,
  } from '@nestjs/common';
  import { Request } from 'express';
import { ISessionService } from '../../../../application/session/service';
import { SessionIdValidator } from '../../../../domain/session/props/sessionId';
import { SESSION_SERVICE_TOKEN, SESSION_ID_VALIDATOR_TOKEN } from '../../../../tokens';
import { SESSION_COOKIE_NAME } from './consts';
import { ApiCookieAuth } from '@nestjs/swagger';
  
@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    @Inject(SESSION_SERVICE_TOKEN)
    private readonly sessionService: ISessionService,

    @Inject(SESSION_ID_VALIDATOR_TOKEN)
    private readonly sessionIdValidator: SessionIdValidator,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const rawSessionId = req.cookies?.[SESSION_COOKIE_NAME];
    if (!rawSessionId) throw new UnauthorizedException();

    const sessionId = await this.sessionIdValidator.validate(rawSessionId);
    const userId = await this.sessionService.validateSessionAndGetUserId(sessionId);

    // кэшируем в request
    (req as any).sessionId = sessionId;
    (req as any).userId = userId;

    return true;
  }
}

export const SessionAuth = () => applyDecorators(
  UseGuards(SessionAuthGuard),
  ApiCookieAuth(SESSION_COOKIE_NAME),
)