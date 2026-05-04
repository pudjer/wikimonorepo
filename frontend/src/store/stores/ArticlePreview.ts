import api from "../../api";
import { ArticleFull, getArticleFullKey } from "./ArticleFull";
import { ArticleMinified, getArticleMinifiedKey } from "./ArticleMinified";
import { builder, CompileString, resolver, UUIDListPattern, UUIDPattern } from "../observableStoreConfig";
import { ArticlePreviewResultDTO } from "../../api";

export const ArticlePreviewPattern = "articlePreview";
export const getArticlePreviewKey = (id: string) => CompileString([ArticlePreviewPattern, id]);

export class ArticlePreview {
  articleId: string;
  title: string;
  authorId: string;
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
  CompileString([ArticlePreviewPattern, UUIDPattern]),
  ArticlePreview,
  async (article, key) => {
    const segments = key.split('/');
    const articleId = segments[1];
    const data = await api.publicArticlePreview.getById(articleId)

    article.articleId = data.articleId;
    article.title = data.title;
    article.authorId = data.authorId;
    article.views = data.views;
    article.likes = data.likes;
    article.learners = data.learners;
    article.masters = data.masters;
    article.dagPoints = data.dagPoints;
  }
);


export const ArticlePreviewCollectionPattern = "articlePreviewCollection";
export const getArticlePreviewCollectionKey = (ids: string[]) => CompileString([ArticlePreviewCollectionPattern, ids.toSorted().join('&')]);
builder.buildRuleSimple(
  CompileString([ArticlePreviewCollectionPattern, UUIDListPattern]),
  Array,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (target, key, _, allocated) => {
    const segments = key.split('/');
    const articleIds = segments[1].split('&');
    const data = await api.publicArticlePreview.getByIds({ids: articleIds});
    for (const statData of data.statistics) {
      const stat = allocated<ArticlePreview>(getArticlePreviewKey(statData.articleId))
      stat.articleId = statData.articleId;
      stat.title = statData.title;
      stat.authorId = statData.authorId;
      stat.views = statData.views;
      stat.likes = statData.likes;
      stat.learners = statData.learners;
      stat.masters = statData.masters;
      stat.dagPoints = statData.dagPoints;
      target.push(stat);
    }
  }
);
