import api from "../../../api";
import { f } from "../../../lib";
import { ArticleBase } from "./ArticleBase";
import { ArticlePreview, ArticlePreviewRule } from "./ArticlePreview";

export class ArticleLink {
  constructor(public name: string, public parent: string) {}
  async getParentPreview(): Promise<ArticlePreview> {
    return await ArticlePreviewRule.resolveOutside(this.parent);
  }
  async getParent(): Promise<Article> {
    return await ArticleRule.resolveOutside(this.parent);
  }
}




export class Article extends ArticleBase {
  content: string;
  links: ArticleLink[];
  createdAt: Date;
  updatedAt: Date;
  async getPreview(): Promise<ArticlePreview> {
    return await ArticlePreviewRule.resolveOutside(this.id);
  }
}

export const ArticleRule = f.buildRule(
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





