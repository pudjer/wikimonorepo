import { LearnProgressStage } from "backend/src/domain/interactionUserArticle/learnProgress/entity";
import mutationApi from "../api/mutationApi";
import { MyLearningStatsRule } from "./stores/private/MeBuild/LearningStats";
import { ArticleRule } from "./stores/public/ArticleFull";
import { ArticlePreviewRule } from "./stores/public/ArticlePreview";
import { AuthorRule } from "./stores/public/Author";
import { AuthorsArticlesRule } from "./stores/public/AuthorsArticles";
import { DAGRule } from "./stores/public/DAG";
import { InOrderRule } from "./stores/public/InOrder";
import { SearchPreviews } from "./stores/public/SearchPreviews";
import { RootRule } from "./stores/Root";

export const use = async () => {
  const art = await ArticlePreviewRule.resolveOutside("72d2ad66-794e-4666-b40f-793496ae5adb");
  console.log(art);
  const artFull = await ArticleRule.resolveOutside("72d2ad66-794e-4666-b40f-793496ae5adb");
  console.log(artFull);
  const link = artFull.links[0];
  console.log(link);
  const parent = link.parent;
  console.log(parent);
  const author = await AuthorRule.resolveOutside(parent.authorId);
  console.log(author);
  const articles = await AuthorsArticlesRule.resolveOutside(author.id);
  console.log(articles);
  const dag = await DAGRule.resolveOutside("72d2ad66-794e-4666-b40f-793496ae5adb");
  console.log(dag);
  await mutationApi.public.login({
    "username": "st22ring",
    "password": "striDD@@33ng"
  });
  const root = await RootRule.resolveOutside(undefined);
  console.log(root);
  if (root.me){
    const interaction = root.me.learningHistory[0]
    const stat = (await MyLearningStatsRule.resolveOutside(undefined)).getStats(interaction)

    console.log(stat?.getTransitiveScore());
    root.me.myLearningStats.dag.nodes.forEach(async (node) => {
      const int = node;
      if (int && (int !== interaction)) int.learnProgressStage = LearnProgressStage.Mastered;
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(stat?.getTransitiveScore());
  }

  const search = await SearchPreviews({ query: "string" });
  console.log(search);

  const inOrder = await InOrderRule.resolveOutside("DESC:learners");
  console.log(inOrder);
}