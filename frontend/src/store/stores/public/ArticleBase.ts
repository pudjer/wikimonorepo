import { resolveOutside } from "../../../lib/observableStoreConfig";
import { TotalInteraction, TotalInteractionsRule } from "../private/TotalInteractions";
import { Author, AuthorRule } from "./Author";
import { NullIfUnauthorized } from "../private/NullIfUnauthorized";
import { LearningStats } from "../../../domain/learningDAG/stats";
import { MyInteractionStatsRule } from "../private/Me";
import { NoNodeInGraphError } from "../../../domain/DAG/entity";

export class ArticleBase{
  id: string;
  authorId: string;
  title: string;
  async getAuthor(): Promise<Author> {
    return await resolveOutside(this.authorId, AuthorRule);
  }
  async getInteractions(): Promise<TotalInteraction | null> {
    return NullIfUnauthorized(resolveOutside(this.id, TotalInteractionsRule))
  }
  async getStats(): Promise<LearningStats<TotalInteraction> | null> {
    const interactions = await this.getInteractions();
    if (!interactions) return null;
    const stats = await resolveOutside(undefined, MyInteractionStatsRule)
    try{
      return stats.getStats(interactions);
    }catch(e){
      if (e instanceof NoNodeInGraphError) return null;
      throw e;
    }
  }
}