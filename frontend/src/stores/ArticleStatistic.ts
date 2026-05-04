import api from "../api";
import { ArticleFull, getArticleFullKey } from "./ArticleFull";
import { ArticleMinified, getArticleMinifiedKey } from "./ArticleMinified";
import { builder, CompileString, resolver, UUIDListPattern, UUIDPattern } from "./storeConfig";

export const ArticleStatisticPattern = "articleStatistic";
export const getArticleStatisticKey = (id: string) => CompileString([ArticleStatisticPattern, id]);

export class ArticleStatistic {
  articleId: string;
  views: number;
  likes: number;
  learners: number;
  masters: number;
  dagPoints: number;
  async getArticleFull(): Promise<ArticleFull> {
    return await resolver.resolveOutside<ArticleFull>(getArticleFullKey(this.articleId));
  }
  async getArticleMinified(): Promise<ArticleMinified> {
    return await resolver.resolveOutside<ArticleMinified>(getArticleMinifiedKey(this.articleId));
  }
}

builder.buildRuleSimple(
  CompileString([ArticleStatisticPattern, UUIDPattern]),
  ArticleStatistic,
  async (article, key) => {
    const segments = key.split('/');
    const articleId = segments[1];
    const data = await api.publicArticleStatistic.getById(articleId)

    article.articleId = data.articleId;
    article.views = data.views;
    article.likes = data.likes;
    article.learners = data.learners;
    article.masters = data.masters;
    article.dagPoints = data.dagPoints;
  }
);



export const ArticleStatisticCollectionPattern = "articleStatisticCollection";
export const getArticleStatisticCollectionKey = (ids: string[]) => CompileString([ArticleStatisticCollectionPattern, ids.toSorted().join('&')]);
builder.buildRuleSimple(
  CompileString([ArticleStatisticCollectionPattern, UUIDListPattern]),
  Array,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (target, key, _, allocated) => {
    const segments = key.split('/');
    const articleIds = segments[1].split('&');
    const data = await api.publicArticleStatistic.getByIds({ids: articleIds});
    for (const statData of data.statistics) {
      const stat = allocated<ArticleStatistic>(getArticleStatisticKey(statData.articleId))
      stat.articleId = statData.articleId;
      stat.views = statData.views;
      stat.likes = statData.likes;
      stat.learners = statData.learners;
      stat.masters = statData.masters;
      stat.dagPoints = statData.dagPoints;
      target.push(stat);
    }
  }
);