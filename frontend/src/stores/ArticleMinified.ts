import api from "../api";
import { Article, getArticleKey } from "./Article";
import { Author, getAuthorKey } from "./Author";
import { builder, CompileString, resolver, UUIDPattern } from "./storeConfig";

export class ArticleMinified{
  id: string;
  title: string;
  authorId: string;
  async getAuthor(): Promise<Author> {
    return await resolver.resolveOutside<Author>(getAuthorKey(this.authorId));
  }
  async getFullArticle(): Promise<Article> {
    return await resolver.resolveOutside<Article>(getArticleKey(this.id));
  }
}

const ArticleMinifiedPattern = "articleMinified";


builder.buildRuleSimple(
  CompileString([ArticleMinifiedPattern, UUIDPattern]),
  ArticleMinified,
  async (article, key) => {
    const segments = key.split('/');
    const articleId = segments[1];
    const data = await api.publicArticles.getMinifiedById(articleId);

    article.id = data.id;
    article.title = data.title;
    article.authorId = data.authorId;
  }
);

export const getArticleMinifiedKey = (id: string) => CompileString([ArticleMinifiedPattern, id])