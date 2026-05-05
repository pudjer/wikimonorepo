import { ArticlePreview } from '../../domain/articlePreview/entity';
import { ArticlePreviewResultDTO, ArticlePreviewCollectionResultDTO } from './DTO';

export const resultMapper = (stat: ArticlePreview): ArticlePreviewResultDTO => ({
  id: stat.id,
  title: stat.title,
  authorId: stat.authorId,
  views: stat.views.value,
  likes: stat.likes.value,
  learners: stat.learners.value,
  masters: stat.masters.value,
  dagPoints: stat.dagPoints.value,
});

export const collectionResultMapper = (stats: ArticlePreview[]): ArticlePreviewCollectionResultDTO => ({
  previews: stats.map(resultMapper),
});
