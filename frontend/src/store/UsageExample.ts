import api, { LearnProgressStage } from "../api";
import { ArticlePreviewRule } from "./stores/public/ArticlePreview";
import { DAGRule } from "./stores/public/DAG";
import { InOrderRule } from "./stores/public/InOrder";
import { SearchPreviews } from "./stores/public/SearchPreviews";
import { RootRule } from "./stores/Root";

export const use = async () => {
  const art = await ArticlePreviewRule.resolveOutside("72d2ad66-794e-4666-b40f-793496ae5adb");
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
  const dag = await DAGRule.resolveOutside("72d2ad66-794e-4666-b40f-793496ae5adb");
  console.log(dag);
  await api.login.login({
    "username": "st22ring",
    "password": "striDD@@33ng"
  });
  const root = await RootRule.resolveOutside(undefined);
  console.log(root);
  if (root.me){
    const interaction = root.me.learningHistory[0]
    const stat = await interaction.getStats();

    console.log(stat?.getTransitiveScore());
    await root.me.myDAG.nodes.forEach(async (node) => {
      const int = await node.getInteractions()
      if (int && (int !== interaction)) int.learnProgressStage = LearnProgressStage.Mastered
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(stat?.getTransitiveScore());
  }

  const search = await SearchPreviews({ query: "string" });
  console.log(search);

  const inOrder = await InOrderRule.resolveOutside("DESC:learners");
  console.log(inOrder);
}