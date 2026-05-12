import queryApi from "../../../api/queryApi";
import { f } from "../../../lib";
import { ArticleBase } from "./ArticleBase";

export class Preview extends ArticleBase{
  views: number;
  likes: number;
  learners: number;
  masters: number;
  dagPoints: number;
}

export const PreviewRule = f.buildRule(
  async (id: string) => await queryApi.public.articlePreview.getById(id),
  { classConstructor: Preview }
)

export const PreviewListRule = f.buildRule(
  async (sortedIds: string[]) => {
    const res = await queryApi.public.articlePreview.getByIds({ ids: sortedIds });
    return res.previews;
  },
  { 
    classConstructor: Array<Preview>,
    update: async (target, data, resolve) => {
      target.length = 0;
      for (const preview of data) {
        target.push(await PreviewRule.resolveInside(resolve, preview.id, preview));
      }
    },
  }
)
