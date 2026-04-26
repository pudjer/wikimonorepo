import { Injectable } from '@nestjs/common';
import { BadValueError } from "../../common/domainErrors";
import { IValidator } from '../../common/IValidator';

declare const ContentSymbol: unique symbol

export type Content = string & {
  readonly [ContentSymbol]: void
}


export interface ContentValidator extends IValidator<string, Content> {}

export class BadContentError extends BadValueError{}
