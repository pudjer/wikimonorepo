import { Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { ArticlePreview } from "../../store/stores/public/ArticlePreview";

export function ArticlePreviewMini({ article, relevanceScore, snippet }: { 
  article: ArticlePreview;
  relevanceScore?: number;
  snippet?: string;
}) {
  return (
    <Card variant="outlined">
      <CardActionArea component={RouterLink} to={`/article/${article.id}`}>
        <CardContent>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
              {article.title}
            </Typography>
            {typeof relevanceScore === "number" ? (
              <Typography variant="caption" color="text.secondary">
                relevance: {relevanceScore.toFixed(3)}
              </Typography>
            ) : null}
            {snippet ? (
              <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {snippet}
              </Typography>
            ) : null}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

