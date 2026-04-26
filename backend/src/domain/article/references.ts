import { Inject, Injectable } from "@nestjs/common";
import { IValidator } from "../common/IValidator";
import { BadValueError } from "../common/domainErrors";
import { ArticleId, ArticleIdValidator } from "./props/articleId";
import { ARTICLE_ID_VALIDATOR_TOKEN, ARTICLE_TO_ARTICLE_LINK_NAME_VALIDATOR } from "../../tokens";
import { Equatable, UniqueCollection } from "../utils/collections";


declare const ArticleToArticleLinkNameSymbol: unique symbol
export type ArticleToArticleLinkName = string & {
  readonly [ArticleToArticleLinkNameSymbol]: void
}
export interface ArticleToArticleLinkNameValidator extends IValidator<string, ArticleToArticleLinkName>{}
export class BadArticleToArticleLinkNameError extends BadValueError{}


export class ArticleReference implements Equatable<ArticleReference> {
  constructor(
    public name: ArticleToArticleLinkName, 
    public parent: ArticleId
  ){}
  equals(link: ArticleReference): boolean{
    return this.name === link.name && this.parent === link.parent
  }
}


export class ArticleReferences extends UniqueCollection<ArticleReference> { }
export type ArticleReferencesRaw = {
  name: string,
  parent: string
}[]

@Injectable()
export class ArticleReferencesValidator implements IValidator<ArticleReferencesRaw, ArticleReferences> {
  constructor(
    @Inject(ARTICLE_TO_ARTICLE_LINK_NAME_VALIDATOR) private readonly articleToArticleLinkNameValidator: ArticleToArticleLinkNameValidator,
    @Inject(ARTICLE_ID_VALIDATOR_TOKEN) private readonly articleIdValidator: ArticleIdValidator
  ){}
  async validate(references: ArticleReferencesRaw): Promise<ArticleReferences> {
    const links: ArticleReference[] = []
    for(const ref of references){
      const name = await this.articleToArticleLinkNameValidator.validate(ref.name)
      const parent = await this.articleIdValidator.validate(ref.parent)
      links.push(new ArticleReference(name, parent))
    }
    return new ArticleReferences(links)
  }
}
