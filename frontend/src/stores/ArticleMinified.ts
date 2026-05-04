import api from "../api";
import { ArticleFull, getArticleFullKey } from "./ArticleFull";
import { ArticleBase } from "./ArticleBase";
import { builder, CompileString, resolver, UUIDPattern } from "./observableStoreConfig";

export class ArticleMinified extends ArticleBase{
  title: string;
  async getFullArticle(): Promise<ArticleFull> {
    return await resolver.resolveOutside<ArticleFull>(getArticleFullKey(this.id));
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