import { Injectable } from '@nestjs/common';
import { BadValueError } from "../../common/domainErrors";
import { IValidator } from '../../common/IValidator';

declare const QuerySymbol: unique symbol

export type QueryText = string & {
  readonly [QuerySymbol]: void
}


export interface QueryTextValidator extends IValidator<string, QueryText>{}

export class BadQueryTextError extends BadValueError{}
