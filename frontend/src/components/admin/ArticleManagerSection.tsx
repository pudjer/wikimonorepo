import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useStores } from "../../hooks/useStores";

export const ArticleManagerSection = observer(function ArticleManagerSection() {
  const { articleStore } = useStores();
  const navigate = useNavigate();
  const [articleIdInput, setArticleIdInput] = useState("");

  const article = articleIdInput ? articleStore.articles.get(articleIdInput) : undefined;

  const handleFetchArticle = () => {
    if (articleIdInput) articleStore.fetchById(articleIdInput, false);
  };

  const handleAdminDeleteArticle = async () => {
    if (!articleIdInput) return;
    await articleStore.adminDelete(articleIdInput);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Manage Article
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          label="Article ID"
          size="small"
          value={articleIdInput}
          onChange={(e) => setArticleIdInput(e.target.value)}
        />
        <Button variant="outlined" onClick={handleFetchArticle}>
          Fetch
        </Button>
      </Box>
      {articleStore.isLoading && <CircularProgress size={24} />}
      {article && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">{article.title}</Typography>
          <Button size="small" onClick={() => navigate(`/article/${article.id}/edit`)}>
            Edit
          </Button>
          <Button size="small" color="error" onClick={handleAdminDeleteArticle}>
            Delete (Admin)
          </Button>
        </Box>
      )}
    </Paper>
  );
});

