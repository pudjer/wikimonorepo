import api from "../api";
import { Author, getAuthorKey } from "./Author";
import { CompileString, UUIDPattern, builder } from "./storeConfig";

export class ArticleLink {
  name: string;
  parent: string;
}

export class Article {
  id: string;
  title: string;
  content: string;
  author: Author;
  links: ArticleLink[];
  createdAt: Date;
  updatedAt: Date;
}

export const ArticlePattern = "article";


builder.buildRuleSimple(
  CompileString([ArticlePattern, UUIDPattern]),
  Article,
  async (article, key, resolve) => {
    const segments = key.split('/');
    const articleId = segments[1];
    const data = await api.publicArticles.getById(articleId);

    article.id = data.id;
    article.title = data.title;
    article.content = data.content;
    article.links = data.links;
    article.createdAt = new Date(data.createdAt);
    article.updatedAt = new Date(data.updatedAt);

    article.author = await resolve(getAuthorKey(data.authorId));
  }
);

export const getArticleKey = (id: string) => CompileString([ArticlePattern, id])





