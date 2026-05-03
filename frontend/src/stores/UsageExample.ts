import { Article, getArticleKey } from "./Article";
import { resolver } from "./storeConfig";

(async () => {
  const art = await resolver.resolveOutside<Article>(getArticleKey("5e3f9fdd-3728-427e-add8-ecc506eb652a"));
  console.log(art);
})();
