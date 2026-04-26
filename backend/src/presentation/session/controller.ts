import {
    Controller,
    Post,
    Body,
    Inject,
    Res,
    UseGuards,
  } from '@nestjs/common';
  import {
    ApiBadRequestResponse,
    ApiForbiddenResponse,
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiCookieAuth,
  } from '@nestjs/swagger';
  import { Response } from 'express';
import { ILoginUseCase } from '../../application/loginUseCase';
import { ISessionService } from '../../application/session/service';
import { SessionId } from '../../domain/session/props/sessionId';
import { PasswordValidator } from '../../domain/user/props/password';
import { UsernameValidator } from '../../domain/user/props/username';
import { LOGIN_USE_CASE_TOKEN, SESSION_SERVICE_TOKEN, USERNAME_VALIDATOR_TOKEN, PASSWORD_VALIDATOR_TOKEN } from '../../tokens';
import { SESSION_COOKIE_NAME } from '../common/auth/session/consts';
import { SessionAuth } from '../common/auth/session/sessionGuard';
import { SessionIdParam } from '../common/auth/paramDecorators';
import { LoginDto, SessionDto } from './DTO';
import { Success } from '../common/DTO';
  

@SessionAuth()
@ApiTags('session')
@Controller('session')
export class SessionController {
    constructor(
      @Inject(SESSION_SERVICE_TOKEN)
      private readonly sessionService: ISessionService,
    ) {}
  
    @ApiOperation({ summary: 'Refresh current session' })
    @ApiBadRequestResponse({ description: 'Invalid session (e.g., BadSessionIdError, SessionNotFoundError)' })
    @ApiForbiddenResponse({ description: 'Session expired (e.g., SessionExpiredError)' })
    @ApiResponse({ status: 200, description: 'Session refreshed', type: SessionDto })
    @Post('refresh')
    async refresh(
      @SessionIdParam() sessionId: SessionId,
      @Res({ passthrough: true }) res: Response,
    ): Promise<SessionDto> {
      const newSessionId = await this.sessionService.refresh(sessionId);
  
      res.cookie(SESSION_COOKIE_NAME, newSessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      });
  
      return { sessionId: newSessionId };
    }
  
    @ApiOperation({ summary: 'Logout current session' })
    @ApiResponse({ status: 200, description: 'Logged out', type: Success })
    @Post('logout')
    async logout(
      @SessionIdParam() sessionId: SessionId,
      @Res({ passthrough: true }) res: Response,
    ): Promise<Success> {
      await this.sessionService.endSession(sessionId);
  
      res.clearCookie(SESSION_COOKIE_NAME);
  
      return new Success();
    }
  
    @ApiOperation({ summary: 'Logout all sessions for current user' })
    @ApiResponse({ status: 200, description: 'All sessions logged out', type: Success })
    @Post('logout-all')
    async logoutAll(
      @SessionIdParam() sessionId: SessionId,
      @Res({ passthrough: true }) res: Response,
    ): Promise<Success> {
      await this.sessionService.endUsersSessions(sessionId);
  
      res.clearCookie(SESSION_COOKIE_NAME);
  
      return new Success();
    }
  }