import queryApi from "../../../api/queryApi";
import { f } from "../../../lib";
import { stringToArray } from "../../stringArray";
import { ArticleBase } from "./ArticleBase";

export class ArticlePreview extends ArticleBase{
  views: number;
  likes: number;
  learners: number;
  masters: number;
  dagPoints: number;
}

export const ArticlePreviewRule = f.buildRule(
  async (id: string) => await queryApi.public.articlePreview.getById(id),
  { classConstructor: ArticlePreview }
)

export const ArticlePreviewCollectionRule = f.buildRule(
  async (sortedIdsAmpersandTerminated: string) => {
    const ids = stringToArray(sortedIdsAmpersandTerminated)
    const res = await queryApi.public.articlePreview.getByIds({ ids })
    return res.previews;
  },
  { 
    classConstructor: Array<ArticlePreview>,
    update: async (target, data, resolve) => {
      target.length = 0;
      for (const preview of data) {
        target.push(await ArticlePreviewRule.resolveInside(resolve, preview.id, preview));
      }
    },
  }
)
