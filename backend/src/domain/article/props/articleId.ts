import { Injectable } from '@nestjs/common';
import { BadValueError } from "../../common/domainErrors";
import { IValidator } from '../../common/IValidator';
import { IPropFactory } from '../../common/IPropFactory';

declare const ArticleIdSymbol: unique symbol

export type ArticleId = string & {
  readonly [ArticleIdSymbol]: void
}


export interface ArticleIdValidator extends IValidator<string, ArticleId>{}
export class BadArticleIdError extends BadValueError{}

export interface ArticleIdFactory extends IPropFactory<ArticleId>{}
