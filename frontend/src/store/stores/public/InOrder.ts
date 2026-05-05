import { PreviewOrderingProp, PreviewOrder } from "backend/src/domain/articlePreview/entity";
import { api } from "../../../api";
import { buildRule } from "../../../lib/observableStoreConfig";
import { ArticlePreview, ArticlePreviewRule } from "./ArticlePreview";


export type OrderColonOrderBy = `${PreviewOrder}:${PreviewOrderingProp}`
export const InOrderRule = buildRule(
  async (orderColonOrderBy: OrderColonOrderBy) => {
    const [order, orderingProp] = orderColonOrderBy.split(":") as [PreviewOrder, PreviewOrderingProp]
    return await api.public.articlePreview.getInOrder({ order, orderingProp });
  },
  { 
    classConstructor: Array<ArticlePreview>,
    async update(target, data, resolve) {
      target.length = 0;
      for (const preview of data.previews) {
        target.push(await resolve(preview.id, ArticlePreviewRule, preview));
      }
    },
  }
)