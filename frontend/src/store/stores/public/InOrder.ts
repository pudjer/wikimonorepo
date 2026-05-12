import { OrderDto, queryApi } from "../../../api/queryApi";
import { Preview, PreviewRule } from "./ArticlePreview";
import { f } from "../../../lib";


export const InOrderRule = f.buildRule(
  async (orderDto: OrderDto) => {
    return await queryApi.public.articlePreview.getInOrder(orderDto);
  },
  { 
    classConstructor: Array<Preview>,
    async update(target, data, resolve) {
      target.length = 0;
      for (const preview of data.previews) {
        target.push(await PreviewRule.resolveInside(resolve, preview.id, preview));
      }
    },
  }
)