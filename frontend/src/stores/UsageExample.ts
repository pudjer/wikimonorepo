import { ArticleFull } from "./ArticleFull";
import { getArticleStatisticKey } from "./ArticleStatistic";
import { resolver } from "./observableStoreConfig";

(async () => {
  const art = await resolver.resolveOutside<ArticleFull>(getArticleStatisticKey("5e3f9fdd-3728-427e-add8-ecc506eb652a"));
  console.log(art);
})();
