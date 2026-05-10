import { PreviewOrderingProp, PreviewOrder } from "backend/src/domain/articlePreview/entity";
import { api } from "../../../api";
import { ArticlePreview, ArticlePreviewRule } from "./ArticlePreview";
import { f } from "../../../lib";


export type OrderColonOrderBy = `${PreviewOrder}:${PreviewOrderingProp}`
export const InOrderRule = f.buildRule(
  async (orderColonOrderBy: OrderColonOrderBy) => {
    const [order, orderingProp] = orderColonOrderBy.split(":") as [PreviewOrder, PreviewOrderingProp]
    return await api.public.articlePreview.getInOrder({ order, orderingProp });
  },
  { 
    classConstructor: Array<ArticlePreview>,
    async update(target, data, resolve) {
      target.length = 0;
      for (const preview of data.previews) {
        target.push(await ArticlePreviewRule.resolveInside(resolve, preview.id, preview));
      }
    },
  }
)