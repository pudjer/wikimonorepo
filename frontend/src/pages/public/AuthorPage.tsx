import { Box, Paper, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { f } from "../../lib";
import { AuthorRule } from "../../store/stores/public/Author";
import { AuthorsArticlesRule } from "../../store/stores/public/AuthorsArticles";
import { AuthorMini } from "../../components/public/AuthorMini";
import { ArticlePreviewMini } from "../../components/public/ArticlePreviewMini";

export const AuthorPage = f.observer(function AuthorPage() {
  const { id } = useParams();
  const authorId = id ?? "";

  const author = AuthorRule.useResolve(authorId);
  const articles = AuthorsArticlesRule.useResolve(authorId);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          {author.isPending ? (
            <Typography>Loading...</Typography>
          ) : author.data ? (
            <AuthorMini author={author.data} />
          ) : null}

          <Typography variant="h6" sx={{ mt: 1 }}>
            Articles
          </Typography>

          {articles.isPending ? <Typography>Loading...</Typography> : null}

          {articles.data ? (
            <Stack spacing={2}>
              {articles.data.map((p) => (
                <ArticlePreviewMini key={p.id} article={p} />
              ))}
            </Stack>
          ) : null}
        </Stack>
      </Paper>
    </Box>
  );
});

