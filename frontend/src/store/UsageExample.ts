import { resolveOutside } from "../lib/observableStoreConfig";
import { ArticleMinifiedRule } from "./stores/ArticleMinified";

export const use = async () => {
  const art = await resolveOutside("357c25ed-5e75-4245-9e20-a87d14129f00", ArticleMinifiedRule);
  console.log(art);
  const artFull = await art.getFullArticle();
  console.log(artFull);
  const link = await artFull.links[0];
  console.log(link);
  const parent = await link.getParentFull();
  console.log(parent);
  const author = await parent.getAuthor();
  console.log(author);
  const articles = await author.getArticles();
  console.log(articles);
}