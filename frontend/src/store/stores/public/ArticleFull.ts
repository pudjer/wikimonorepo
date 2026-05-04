import api from "../../../api";
import { buildRule, resolveOutside } from "../../../lib/observableStoreConfig";
import { ArticleBase } from "./ArticleBase";
import { ArticlePreview, ArticlePreviewRule } from "./ArticlePreview";

export class ArticleLink {
  constructor(public name: string, public parent: string) {}
  async getParentPreview(): Promise<ArticlePreview> {
    return await resolveOutside(this.parent, ArticlePreviewRule);
  }
  async getParent(): Promise<Article> {
    return await resolveOutside(this.parent, ArticleRule);
  }
}




export class Article extends ArticleBase {
  title: string;
  content: string;
  links: ArticleLink[];
  createdAt: Date;
  updatedAt: Date;
  async getPreview(): Promise<ArticlePreview> {
    return await resolveOutside(this.id, ArticlePreviewRule);
  }
}

export const ArticleRule = buildRule(
  async (id: string) => await api.public.articles.getById(id),
  { 
    classConstructor: Article , 
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





