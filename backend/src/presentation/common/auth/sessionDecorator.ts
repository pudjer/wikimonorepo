import { applyDecorators } from '@nestjs/common';
import { RoleAuth } from './roleDecorator';
import { BaseRole } from '../../../domain/user/roles';

export const SessionAuth = () => applyDecorators(
  RoleAuth([BaseRole]),
)