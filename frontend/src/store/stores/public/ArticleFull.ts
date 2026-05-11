import queryApi from "../../../api/queryApi";
import { f } from "../../../lib";
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
  async (id: string) => await queryApi.public.articles.getById(id),
  { 
    classConstructor: Article , 
    update: async (article, data) => {
      article.id = data.id;
      article.title = data.title;
      article.content = data.content;
      const parents = await ArticlePreviewCollectionRule.resolveOutside(data.links.map(link => link.parent).toSorted());
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





