import { Injectable } from '@nestjs/common';
import { BadValueError } from "../../common/domainErrors";
import { IValidator } from '../../common/IValidator';

declare const TitleSymbol: unique symbol

export type Title = string & {
  readonly [TitleSymbol]: void
}


export interface TitleValidator extends IValidator<string, Title>{}

export class BadTitleError extends BadValueError{}
