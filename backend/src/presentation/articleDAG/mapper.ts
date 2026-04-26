import { ArticleDAG, ArticleRelations } from '../../domain/articleDAG/entity';
import { ArticleDAGResultDTO, ArticleLinkDTO } from './DTO';

export const resultMapper = (dag: ArticleDAG): ArticleDAGResultDTO => {
  const nodes = Array.from(dag.nodes)
  const links = dag.links.values
  return { nodes, links };
};

