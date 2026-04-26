import { Paper, Typography } from "@mui/material";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <Paper sx={{ p: 3, mb: 3, whiteSpace: "pre-wrap" }}>
      <Typography variant="body1">{content}</Typography>
    </Paper>
  );
}

