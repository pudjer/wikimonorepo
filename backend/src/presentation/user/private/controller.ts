import { BadRequestException, Body, Controller, Get, Inject, Patch } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IUserServicePrivate } from "../../../application/user/private/service";
import { PasswordValidator } from "../../../domain/user/props/password";
import { UserId, UserIdValidator } from "../../../domain/user/props/userId";
import { UsernameValidator } from "../../../domain/user/props/username";
import { BaseRole } from "../../../domain/user/roles";
import { PASSWORD_VALIDATOR_TOKEN, USER_ID_VALIDATOR_TOKEN, USER_SERVICE_PRIVATE_TOKEN, USERNAME_VALIDATOR_TOKEN } from "../../../tokens";
import { RoleAuth } from "../../common/auth/role/roleDecorator";
import { UpdateInputDtoPrivate, UserOutputDtoPrivate } from "./DTO";
import { UpdateUserInputPrivate } from "../../../application/user/private/DTO";
import { UserIdParam } from "../../common/auth/paramDecorators";

@RoleAuth([BaseRole])
@ApiTags('private/user')
@Controller('private/user')
export class UserControllerPrivate {
    constructor(
        @Inject(USER_SERVICE_PRIVATE_TOKEN)
        private readonly userService: IUserServicePrivate,

        @Inject(USERNAME_VALIDATOR_TOKEN)
        private readonly usernameValidator: UsernameValidator,

        @Inject(PASSWORD_VALIDATOR_TOKEN)
        private readonly passwordValidator: PasswordValidator,

    ) {}

    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, type: UserOutputDtoPrivate })
    @Get()
    async get(
        @UserIdParam() userId: UserId,
    ): Promise<UserOutputDtoPrivate> {
        return this.userService.get(userId);
    }

    @ApiOperation({ summary: 'Update current user profile' })
    @ApiBody({ type: UpdateInputDtoPrivate })
    @ApiBadRequestResponse({ description: 'Invalid input or no changes (e.g., BadUsernameError, BadPasswordError)' })
    @ApiConflictResponse({ description: 'Username already exists (e.g., UsernameUniqueError)' })
    @ApiResponse({ status: 200, description: 'User updated', type: UserOutputDtoPrivate })
    @Patch()
    async update(
        @UserIdParam() userId: UserId,
        @Body() dto: UpdateInputDtoPrivate,
    ): Promise<UserOutputDtoPrivate > {
        if (dto.username === undefined && dto.password === undefined) {
            throw new BadRequestException();
        }
        const input: UpdateUserInputPrivate = {};

        if (dto.username !== undefined) {
            input.username = await this.usernameValidator.validate(dto.username);
        }

        if (dto.password !== undefined) {
            input.password = await this.passwordValidator.validate(dto.password);
        }

        return this.userService.update(input, userId);
    }
}