import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const UserIdParam = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (!req.userId) {
      throw new UnauthorizedException();
    }

    return req.userId;
  },
);



export const SessionIdParam = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (!req.sessionId) {
      throw new UnauthorizedException();
    }

    return req.sessionId;
  },
);