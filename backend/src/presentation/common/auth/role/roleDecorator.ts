
import { Reflector } from '@nestjs/core';
import { RoleClass } from '../../../../domain/user/roles';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { SESSION_COOKIE_NAME } from '../session/consts';
import { RolesGuard } from './guard';

export const RolesDecorator = Reflector.createDecorator<RoleClass[]>();

export const RoleAuth = (roles: RoleClass[]) => applyDecorators(
    RolesDecorator(roles),
    UseGuards(RolesGuard),
    ApiCookieAuth(SESSION_COOKIE_NAME),
);