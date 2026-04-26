import { Controller, Inject, Post, Body, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBadRequestResponse, ApiForbiddenResponse, ApiResponse, ApiBody } from "@nestjs/swagger";
import { ILoginUseCase } from "../../application/loginUseCase";
import { PasswordValidator } from "../../domain/user/props/password";
import { UsernameValidator } from "../../domain/user/props/username";
import { LOGIN_USE_CASE_TOKEN, USERNAME_VALIDATOR_TOKEN, PASSWORD_VALIDATOR_TOKEN } from "../../tokens";
import { SESSION_COOKIE_NAME } from "../common/auth/session/consts";
import { LoginDto, SessionDto } from "./DTO";
import { Response } from "express";

@ApiTags('login')
@Controller('login')
export class LoginController {
    constructor(
      @Inject(LOGIN_USE_CASE_TOKEN)
      private readonly loginUseCase: ILoginUseCase,
  
      @Inject(USERNAME_VALIDATOR_TOKEN)
      private readonly usernameValidator: UsernameValidator,
  
      @Inject(PASSWORD_VALIDATOR_TOKEN)
      private readonly passwordValidator: PasswordValidator,
    ) {}
  
    @ApiOperation({ summary: 'Login user and set session cookie' })
    @ApiBody({ type: LoginDto })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadUsernameError, BadPasswordError)' })
    @ApiForbiddenResponse({ description: 'Invalid credentials (authority errors)' })
    @ApiResponse({ status: 200, description: 'Login successful', type: SessionDto })
    @Post()
    async login(
      @Body() dto: LoginDto,
      @Res({ passthrough: true }) res: Response,
    ): Promise<SessionDto> {
      const username = await this.usernameValidator.validate(dto.username);
      const password = await this.passwordValidator.validate(dto.password);
  
      const sessionId = await this.loginUseCase.login(username, password);
  
      res.cookie(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
  
      return { sessionId };
    }
}