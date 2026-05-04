import api from "../api";
import { getArticleMinifiedKey } from "./ArticleMinified";
import { builder, CompileString, UUIDPattern } from "./observableStoreConfig";

const authorsArticlesPattern = "authorsArticles";
builder.buildRuleSimple(
  CompileString([authorsArticlesPattern, UUIDPattern]),
  Array,
  async (target, key, resolve) => {
    const segments = key.split('/');
    const authorId = segments[1];
    const data = await api.publicArticles.getByAuthorId(authorId);

    target.length = 0;
    for (const articleId of data.ids) {
      target.push(await resolve(getArticleMinifiedKey(articleId)));
    }
  }
);

export const getAuthorsArticlesKey = (id: string) => CompileString([authorsArticlesPattern, id])