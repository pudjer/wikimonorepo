import { Injectable } from '@nestjs/common';
import { BadValueError } from "../../common/domainErrors";
import { IValidator } from '../../common/IValidator';

declare const PasswordSymbol: unique symbol
export type Password = string & {
  readonly [PasswordSymbol]: void
}


export interface PasswordValidator extends IValidator<string, Password>{}

export class BadPasswordError extends BadValueError{}


declare const PasswordHashSymbol: unique symbol
export type PasswordHash = string & {
  readonly [PasswordHashSymbol]: void
}


