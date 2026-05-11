import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ISessionService } from '../../../application/session/service';
import { SessionIdValidator } from '../../../domain/session/props/sessionId';
import { SESSION_SERVICE_TOKEN, SESSION_ID_VALIDATOR_TOKEN, USER_SERVICE_ADMIN_TOKEN } from '../../../tokens';
import { SESSION_COOKIE_NAME } from './consts';
import { IUserServiceAdmin } from '../../../application/user/admin/service';
import { RolesDecorator } from './roleDecorator';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    @Inject(SESSION_SERVICE_TOKEN)
    private readonly sessionService: ISessionService,

    @Inject(SESSION_ID_VALIDATOR_TOKEN)
    private readonly sessionIdValidator: SessionIdValidator,

    @Inject(USER_SERVICE_ADMIN_TOKEN)
    private readonly userService: IUserServiceAdmin,

    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();

    const roles = this.reflector.getAllAndOverride(RolesDecorator, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return next.handle();
    }

    // Session validation
    const rawSessionId = req.cookies?.[SESSION_COOKIE_NAME];
    if (!rawSessionId) throw new UnauthorizedException();

    const sessionId = await this.sessionIdValidator.validate(rawSessionId);
    const userId = await this.sessionService.validateSessionAndGetUserId(sessionId);

    // Cache in request
    (req as any).sessionId = sessionId;
    (req as any).userId = userId;


    if (roles.length > 0) {
      const user = await this.userService.getByAdmin(userId);

      const hasRole = roles.some(Role => user.role instanceof Role);
      if (!hasRole) throw new ForbiddenException();
    }

    return next.handle();
  }
}
