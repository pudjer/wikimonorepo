import api from "../../../api";
import { f } from "../../../lib";
import { arrayToString } from "../../stringArray";
import { ArticleBase } from "./ArticleBase";
import { ArticlePreview, ArticlePreviewCollectionRule } from "./ArticlePreview";

export class ArticleLink {
  name: string;
  parent: ArticlePreview;
}




export class Article extends ArticleBase {
  content: string;
  links: ArticleLink[];
  createdAt: Date;
  updatedAt: Date;
}

export const ArticleRule = f.buildRule(
  async (id: string) => await api.public.articles.getById(id),
  { 
    classConstructor: Article , 
    update: async (article, data) => {
      article.id = data.id;
      article.title = data.title;
      article.content = data.content;
      const sortedIdsAmpersandTerminated = arrayToString(data.links.map(link => link.parent));
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





