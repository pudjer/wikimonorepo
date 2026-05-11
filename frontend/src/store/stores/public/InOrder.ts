import { OrderDto, queryApi } from "../../../api/queryApi";
import { ArticlePreview, ArticlePreviewRule } from "./ArticlePreview";
import { f } from "../../../lib";


export const InOrderRule = f.buildRule(
  async (orderDto: OrderDto) => {
    return await queryApi.public.articlePreview.getInOrder(orderDto);
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