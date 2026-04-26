import { Injectable } from "@nestjs/common";
import { ArticleToArticleLinkName, ArticleToArticleLinkNameValidator, BadArticleToArticleLinkNameError } from "../../../domain/article/references";

@Injectable()
export class ArticleToArticleLinkNameValidatorImpl implements ArticleToArticleLinkNameValidator {
  async validate(name: string): Promise<ArticleToArticleLinkName> {
    if (name !== "extends") {
      throw new BadArticleToArticleLinkNameError(`Invalid link name: ${name}.`);
    }
    return name as ArticleToArticleLinkName;
  }
}
