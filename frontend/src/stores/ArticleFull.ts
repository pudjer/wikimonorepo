import api from "../api";
import { ArticleBase } from "./ArticleBase";
import { CompileString, UUIDPattern, builder } from "./observableStoreConfig";

export class ArticleLink {
  name: string;
  parent: string;
}




export class ArticleFull extends ArticleBase {
  title: string;
  content: string;
  links: ArticleLink[];
  createdAt: Date;
  updatedAt: Date;
}

export const ArticleFullPattern = "articleFull";


builder.buildRuleSimple(
  CompileString([ArticleFullPattern, UUIDPattern]),
  ArticleFull,
  async (article, key) => {
    const segments = key.split('/');
    const articleId = segments[1];
    const data = await api.publicArticles.getById(articleId);

    article.id = data.id;
    article.title = data.title;
    article.content = data.content;
    article.links = data.links;
    article.createdAt = new Date(data.createdAt);
    article.updatedAt = new Date(data.updatedAt);

    article.authorId = data.authorId;
  }
);

export const getArticleFullKey = (id: string) => CompileString([ArticleFullPattern, id])





