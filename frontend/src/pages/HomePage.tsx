import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Grid } from "@mui/material";
import { PageTitle } from "../components/common/PageTitle";
import { PageSpinner } from "../components/common/PageSpinner";
import { ArticleCard } from "../components/common/ArticleCard";
import { useStores } from "../hooks/useStores";

export const HomePage = observer(function HomePage() {
  const { statisticStore, articleStore } = useStores();

  useEffect(() => {
    statisticStore.fetchTop().then(() => {
      const ids = statisticStore.topStats.map((s) => s.articleId);
      if (ids.length > 0) {
        articleStore.fetchManyByIds(ids);
      }
    });
  }, []);

  return (
    <>
      <PageTitle>Trending Articles</PageTitle>
      {articleStore.isLoading && statisticStore.isLoading ? (
        <PageSpinner />
      ) : (
        <Grid container spacing={2}>
          {statisticStore.topStats.map((stat) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.articleId}>
              <ArticleCard articleId={stat.articleId} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
});

