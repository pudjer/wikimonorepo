import { Injectable } from '@nestjs/common';
import { BadValueError } from "../../common/domainErrors";
import { IValidator } from '../../common/IValidator';

declare const UsernameSymbol: unique symbol

export type Username = string & {
  readonly [UsernameSymbol]: void
}


export interface UsernameValidator extends IValidator<string, Username>{}


export class BadUsernameError extends BadValueError{}
