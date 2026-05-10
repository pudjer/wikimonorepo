import api from "../../../api";
import { f } from "../../../lib";
import { ArticleBase } from "./ArticleBase";
import { ArticlePreview, ArticlePreviewCollectionRule, ArticlePreviewRule } from "./ArticlePreview";

export class ArticleLink {
  name: string;
  parent: ArticlePreview;
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
      const sortedIdsAmpersandTerminated = data.links.map(link => link.parent).toSorted().join("&")
      const parents = await ArticlePreviewCollectionRule.resolveOutside(sortedIdsAmpersandTerminated);
      const parentsMap = new Map(parents.map(parent => [parent.id, parent]));
      article.links = data.links.map(link => ({
        name: link.name,
        parent: parentsMap.get(link.parent)!
      }));
      article.createdAt = new Date(data.createdAt);
      article.updatedAt = new Date(data.updatedAt);
      article.authorId = data.authorId;
    } 
  }
)





