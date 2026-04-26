import { Injectable } from '@nestjs/common';
import { BadTitleError, Title, TitleValidator } from '../../../../domain/article/props/title';


@Injectable()
export class TitleValidatorImpl implements TitleValidator {
  async validate(title: string): Promise<Title> {
    return title as Title;
  }
}
