import { BadRequestException, Body, Controller, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IUserServiceAdmin } from "../../../application/user/admin/service";
import { PasswordValidator } from "../../../domain/user/props/password";
import { UsernameValidator } from "../../../domain/user/props/username";
import { AdminRole, roleByName } from "../../../domain/user/roles";
import { PASSWORD_VALIDATOR_TOKEN, USER_ID_VALIDATOR_TOKEN, USER_SERVICE_ADMIN_TOKEN, USERNAME_VALIDATOR_TOKEN } from "../../../tokens";
import { RoleAuth } from "../../common/auth/role/roleDecorator";
import { UserUpdateInputDtoAdmin, UserOutputDtoAdmin, UserRegisterInputDtoAdmin } from "./DTO";
import { UserIdValidator } from "../../../domain/user/props/userId";
import { RegisterUserInputAdmin, UpdateUserInputAdmin } from "../../../application/user/admin/DTO";

@RoleAuth([AdminRole])
@ApiTags('admin/user')
@Controller('admin/user')
export class UserControllerAdmin {
    constructor(
        @Inject(USER_SERVICE_ADMIN_TOKEN)
        private readonly userService: IUserServiceAdmin,

        @Inject(USERNAME_VALIDATOR_TOKEN)
        private readonly usernameValidator: UsernameValidator,

        @Inject(PASSWORD_VALIDATOR_TOKEN)
        private readonly passwordValidator: PasswordValidator,

        @Inject(USER_ID_VALIDATOR_TOKEN)
        private userIdValidator: UserIdValidator
    ) {}

    @ApiOperation({ summary: 'Update user profile' })
    @ApiBody({ type: UserUpdateInputDtoAdmin })
    @ApiBadRequestResponse({ description: 'Invalid input or no changes (e.g., BadUserIdError, BadUsernameError)' })
    @ApiConflictResponse({ description: 'Username already exists (e.g., UsernameUniqueError)' })
    @ApiResponse({ status: 200, description: 'User updated', type: UserOutputDtoAdmin })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @Patch(':userId')
    async update(
        @Body() dto: UserUpdateInputDtoAdmin,
        @Param('userId') userIdRaw: string
    ): Promise<UserOutputDtoAdmin> {
        
        if (dto.username === undefined && dto.password === undefined && dto.role === undefined) {
            throw new BadRequestException();
        }

        const userId = await this.userIdValidator.validate(userIdRaw);
        const input: UpdateUserInputAdmin = {};

        if (dto.role !== undefined) {
            input.role = roleByName(dto.role);
        }

        if (dto.username !== undefined) {
            input.username = await this.usernameValidator.validate(dto.username);
        }

        if (dto.password !== undefined) {
            input.password = await this.passwordValidator.validate(dto.password);
        }

        const res = await this.userService.updateByAdmin(input, userId);

        return {
            id: res.id,
            username: res.username,
            role: res.role.name
        }
    }

    @ApiOperation({ summary: 'Get user profile' })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadUserIdError)' })
    @ApiNotFoundResponse({ description: 'User not found (e.g., UserNotFoundError)' })
    @ApiResponse({ status: 200, type: UserOutputDtoAdmin })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @Get(":userId")
    async get(
        @Param("userId") userIdRaw: string,
    ): Promise<UserOutputDtoAdmin> {
        const userId = await this.userIdValidator.validate(userIdRaw);
        const res = await this.userService.getByAdmin(userId);
        return {
            id: res.id,
            username: res.username,
            role: res.role.name
        }
    }

    @ApiOperation({ summary: 'Register new user' })
    @ApiBody({ type: UserRegisterInputDtoAdmin })
    @ApiBadRequestResponse({ description: 'Invalid input (e.g., BadUsernameError, BadPasswordError)' })
    @ApiConflictResponse({ description: 'Username already exists (e.g., UsernameUniqueError)' })
    @ApiResponse({ status: 201, description: 'User registered', type: UserOutputDtoAdmin })
    @Post()
    async register(
        @Body() dto: UserRegisterInputDtoAdmin,
    ): Promise<UserOutputDtoAdmin> {
        const username = await this.usernameValidator.validate(dto.username);
        const password = await this.passwordValidator.validate(dto.password);

        const res = await this.userService.registerByAdmin({
            username,
            password,
            role: roleByName(dto.role),
        });

        return {
            id: res.id,
            username: res.username,
            role: res.role.name
        }
    }

}