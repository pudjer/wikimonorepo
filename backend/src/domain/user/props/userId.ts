import { Injectable } from '@nestjs/common';
import { BadValueError } from "../../common/domainErrors";
import { IValidator } from '../../common/IValidator';
import { IPropFactory } from '../../common/IPropFactory';

declare const UserIdSymbol: unique symbol

export type UserId = string & {
  readonly [UserIdSymbol]: void
}


export interface UserIdValidator extends IValidator<string, UserId>{}
export interface UserIdFactory extends IPropFactory<UserId>{}

export class BadUserIdError extends BadValueError{}
