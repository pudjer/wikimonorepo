import { Injectable } from '@nestjs/common';
import { ContentValidator, Content, BadContentError } from '../../../../domain/article/props/content';


@Injectable()
export class ContentValidatorImpl implements ContentValidator {
  async validate(content: string): Promise<Content> {
    return content as Content;
  }
}
