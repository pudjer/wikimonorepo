
import { Reflector } from '@nestjs/core';
import { RoleClass } from '../../../domain/user/roles';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { SESSION_COOKIE_NAME } from './consts';
import { AuthInterceptor } from './sessionInterceptor';

export const RolesDecorator = Reflector.createDecorator<RoleClass[]>();

export const RoleAuth = (roles: RoleClass[]) => applyDecorators(
    UseInterceptors(AuthInterceptor),
    RolesDecorator(roles),
    ApiCookieAuth(SESSION_COOKIE_NAME),
);