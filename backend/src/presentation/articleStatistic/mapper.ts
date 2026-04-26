import { ArticleStatistic } from '../../domain/articleStatistic/entity';
import { ArticleStatisticResultDTO, ArticleStatisticCollectionResultDTO } from './DTO';

export const resultMapper = (stat: ArticleStatistic): ArticleStatisticResultDTO => ({
  articleId: stat.articleId,
  views: stat.views.value,
  likes: stat.likes.value,
  learners: stat.learners.value,
  masters: stat.masters.value,
  dagPoints: stat.dagPoints.value,
});

export const collectionResultMapper = (stats: ArticleStatistic[]): ArticleStatisticCollectionResultDTO => ({
  statistics: stats.map(resultMapper),
});
