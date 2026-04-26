import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { ArticleId, ArticleIdFactory, ArticleIdValidator, BadArticleIdError } from '../../../../domain/article/props/articleId';


const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class ArticleIdFactoryImpl implements ArticleIdFactory {
  async createNew(): Promise<ArticleId> {
    return crypto.randomUUID() as ArticleId;
  }
}

@Injectable()
export class ArticleIdValidatorImpl implements ArticleIdValidator {
  async validate(raw: string): Promise<ArticleId> {
    if (typeof raw !== 'string' || !UUID_V4_REGEX.test(raw)) {
      throw new BadArticleIdError(`Invalid ArticleId format: ${raw}`);
    }
    return raw as ArticleId;
  }
}