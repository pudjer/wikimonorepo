import { Article, ArticlePattern } from "./Article";
import { resolver, CompileString } from "./storeConfig";

(async () => {
  const art = await resolver.resolveOutside<Article>(CompileString([ArticlePattern, "5e3f9fdd-3728-427e-add8-ecc506eb652a"]));
  console.log(art);
})();
