import { Controller, Inject, Post, Res, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { ISessionServiceAdmin } from "../../application/session/serviceAdmin";
import { UserIdValidator } from "../../domain/user/props/userId";
import { AdminRole } from "../../domain/user/roles";
import { SESSION_SERVICE_ADMIN_TOKEN, SESSION_SERVICE_TOKEN, USER_ID_VALIDATOR_TOKEN } from "../../tokens";
import { RoleAuth } from "../common/auth/role/roleDecorator";
import { Success } from "../common/DTO";

@RoleAuth([AdminRole])
@ApiTags('admin/session')
@Controller('admin/session')
export class SessionControllerAdmin {
    constructor(
      @Inject(SESSION_SERVICE_ADMIN_TOKEN)
      private readonly sessionService: ISessionServiceAdmin,

      @Inject(USER_ID_VALIDATOR_TOKEN)
      private readonly userIdValidator: UserIdValidator,
    ) {}

    @ApiOperation({ summary: 'Logout all sessions for user' })
    @ApiResponse({ status: 200, description: 'All sessions logged out', type: Success })
    @ApiParam({ name: 'userId', description: 'User id' })
    @Post(':userId')
    async logoutAll(
      @Param('userId') userIdRaw: string
    ): Promise<Success> {
      const userId = await this.userIdValidator.validate(userIdRaw);
      await this.sessionService.endUsersSessionsAdmin(userId);
      return new Success();
    }
  }