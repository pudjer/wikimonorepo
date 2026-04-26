import { Injectable } from '@nestjs/common';
import { BadValueError } from "../../common/domainErrors";
import { IValidator } from '../../common/IValidator';
import { IPropFactory } from '../../common/IPropFactory';

declare const SessionIdSymbol: unique symbol

export type SessionId = string & {
  readonly [SessionIdSymbol]: void
}

export interface SessionIdValidator  extends IValidator<string, SessionId>{}
export interface SessionIdFactory extends IPropFactory<SessionId>{ }

export class BadSessionIdError extends BadValueError{}
