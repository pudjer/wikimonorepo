import { Injectable, CanActivate, Inject, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { USER_SERVICE_ADMIN_TOKEN } from "../../../../tokens";
import { Request } from "express";
import { IUserServiceAdmin } from "../../../../application/user/admin/service";
import { RolesDecorator } from "./roleDecorator";
import { SessionAuthGuard } from "../session/sessionGuard";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        @Inject(USER_SERVICE_ADMIN_TOKEN)
        private readonly userService: IUserServiceAdmin,

        private reflector: Reflector,

        @Inject(SessionAuthGuard)
        private readonly sessionGuard: SessionAuthGuard
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await this.sessionGuard.canActivate(context);
        const req = context.switchToHttp().getRequest<Request>();
    
        const Roles = this.reflector.getAllAndOverride(RolesDecorator, [
            context.getHandler(),
            context.getClass(),
        ]);
    
        if (!Roles || Roles.length === 0) return true;
    
        const userId = (req as any).userId; // уже должен быть из SessionGuard
        const user = await this.userService.getByAdmin(userId);
    
        for (const Role of Roles) {
            if (user.role instanceof Role) return true;
        }
    
        throw new ForbiddenException();;
    }
}

