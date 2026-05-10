import { Box, Paper, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { f } from "../../lib";
import { ArticleRule } from "../../store/stores/public/ArticleFull";

export const ArticlePage = f.observer(function ArticlePage() {
  const { id } = useParams();
  const articleId = id ?? "";

  const res = ArticleRule.useResolve(articleId);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        {res.isPending ? (
          <Typography>Loading...</Typography>
        ) : res.data ? (
          <Stack spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {res.data.title}
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {res.data.content}
            </Typography>

            {res.data.links?.length ? (
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Links
                </Typography>
                <Stack spacing={1}>
                  {res.data.links.map((l) => (
                    <Typography key={l.parent.title} variant="body2" color="text.secondary">
                      {l.name} → {l.parent.title}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            ) : null}
          </Stack>
        ) : (
          <Typography color="text.secondary">Article not found.</Typography>
        )}
      </Paper>
    </Box>
  );
});

