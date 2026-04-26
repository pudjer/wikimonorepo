import { List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../common/EmptyState";

interface ArticleListProps {
  articleIds: string[];
  emptyMessage?: string;
}

export function ArticleList({ articleIds, emptyMessage = "No articles yet." }: ArticleListProps) {
  const navigate = useNavigate();

  if (articleIds.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <List>
      {articleIds.map((articleId) => (
        <ListItem key={articleId} onClick={() => navigate(`/article/${articleId}`)} sx={{ cursor: "pointer" }}>
          <ListItemText primary={articleId} />
        </ListItem>
      ))}
    </List>
  );
}

