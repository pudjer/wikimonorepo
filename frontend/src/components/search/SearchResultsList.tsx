import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { ArticleSearchResultDto } from "../../api";
import { EmptyState } from "../common/EmptyState";

interface SearchResultsListProps {
  results: ArticleSearchResultDto[];
  query: string;
  isLoading: boolean;
}

export function SearchResultsList({ results, query, isLoading }: SearchResultsListProps) {
  const navigate = useNavigate();

  if (isLoading) return null;
  if (query && results.length === 0) {
    return <EmptyState message="No results found." />;
  }

  return (
    <List>
      {results.map((res) => (
        <ListItem key={res.id} onClick={() => navigate(`/article/${res.id}`)} sx={{ cursor: "pointer" }}>
          <ListItemText primary={res.title} secondary={res.contentSnippet} />
        </ListItem>
      ))}
    </List>
  );
}

