import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { UserIdValidator } from "../../../domain/user/props/userId";
import { ApiTags, ApiOperation, ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";
import { IUserServicePublic } from "../../../application/user/public/service";
import { PASSWORD_VALIDATOR_TOKEN, USER_ID_VALIDATOR_TOKEN, USER_SERVICE_PUBLIC_TOKEN, USERNAME_VALIDATOR_TOKEN } from "../../../tokens";
import { UserOutputDtoPublic, UserRegisterInputDtoPublic } from "./DTO";
import { PasswordValidator } from "../../../domain/user/props/password";
import { UsernameValidator } from "../../../domain/user/props/username";
import { RegisterOutputDto } from "../DTO";

@ApiTags('public/user')
@Controller('public/user')
export class UserControllerPublic {
    constructor(
        @Inject(USER_SERVICE_PUBLIC_TOKEN)
        private readonly userService: IUserServicePublic,

        @Inject(USER_ID_VALIDATOR_TOKEN)
        private userIdValidator: UserIdValidator,

        @Inject(USERNAME_VALIDATOR_TOKEN)
        private readonly usernameValidator: UsernameValidator,

        @Inject(PASSWORD_VALIDATOR_TOKEN)
        private readonly passwordValidator: PasswordValidator,
    ) {}

    @ApiOperation({ summary: 'Get user profile' })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadUserIdError)' })
    @ApiNotFoundResponse({ description: 'User not found (e.g., UserNotFoundError)' })
    @ApiResponse({ status: 200, type: UserOutputDtoPublic })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @Get(":userId")
    async get(
        @Param("userId") userIdRaw: string,
    ): Promise<UserOutputDtoPublic> {
        const userId = await this.userIdValidator.validate(userIdRaw);
        return this.userService.get(userId);
    }

    
    @ApiOperation({ summary: 'Register new user' })
    @ApiBody({ type: UserRegisterInputDtoPublic })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadUsernameError, BadPasswordError)' })
    @ApiConflictResponse({ description: 'Username already exists (e.g., UsernameUniqueError)' })
    @ApiResponse({ status: 201, description: 'User registered', type: UserRegisterInputDtoPublic })
    @Post()
    async register(
        @Body() dto: UserRegisterInputDtoPublic,
    ): Promise<RegisterOutputDto> {
        const username = await this.usernameValidator.validate(dto.username);
        const password = await this.passwordValidator.validate(dto.password);

        return this.userService.register({
            username,
            password,
        });
    }
}