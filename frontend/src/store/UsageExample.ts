import { resolveOutside } from "../lib/observableStoreConfig";
import { ArticlePreviewRule } from "./stores/public/ArticlePreview";
import { DAGRule } from "./stores/public/DAG";
import { RootRule } from "./stores/Root";

export const use = async () => {
  const art = await resolveOutside("357c25ed-5e75-4245-9e20-a87d14129f00", ArticlePreviewRule);
  console.log(art);
  const artFull = await art.getArticle();
  console.log(artFull);
  const link = await artFull.links[0];
  console.log(link);
  const parent = await link.getParent();
  console.log(parent);
  const author = await parent.getAuthor();
  console.log(author);
  const articles = await author.getArticles();
  console.log(articles);
  const dag = await resolveOutside("357c25ed-5e75-4245-9e20-a87d14129f00", DAGRule);
  console.log(dag);
  const root = await resolveOutside(undefined, RootRule);
  console.log(root);
}