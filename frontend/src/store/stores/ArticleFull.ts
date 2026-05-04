import api from "../../api";
import { buildRule, resolveOutside } from "../../lib/observableStoreConfig";
import { ArticleBase } from "./ArticleBase";
import { ArticleMinified, ArticleMinifiedRule } from "./ArticleMinified";

export class ArticleLink {
  constructor(public name: string, public parent: string) {}
  async getParentMinified(): Promise<ArticleMinified> {
    return await resolveOutside(this.parent, ArticleMinifiedRule);
  }
  async getParentFull(): Promise<ArticleFull> {
    return await resolveOutside(this.parent, ArticleFullRule);
  }
}




export class ArticleFull extends ArticleBase {
  title: string;
  content: string;
  links: ArticleLink[];
  createdAt: Date;
  updatedAt: Date;
}

export const ArticleFullRule = buildRule(
  async (id: string) => await api.publicArticles.getById(id),
  { 
    classConstructor: ArticleFull , 
    update: async (article, data) => {
      article.id = data.id;
      article.title = data.title;
      article.content = data.content;
      article.links = data.links.map((link) => new ArticleLink(link.name, link.parent));
      article.createdAt = new Date(data.createdAt);
      article.updatedAt = new Date(data.updatedAt);
      article.authorId = data.authorId;
    } 
  }
)





