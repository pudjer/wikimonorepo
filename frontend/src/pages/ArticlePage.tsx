import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Box, Link, Button } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { PageSpinner } from "../components/common/PageSpinner";
import { ArticleContent } from "../components/article/ArticleContent";
import { ArticleStats } from "../components/article/ArticleStats";
import { ArticleReferences } from "../components/article/ArticleReferences";
import { ArticleActions } from "../components/article/ArticleActions";
import { DeleteConfirmDialog } from "../components/form/DeleteConfirmDialog";
import { DagVisualizer } from "../components/dag/DagVisualizer";
import { useStores } from "../hooks/useStores";

export const ArticlePage = observer(function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articleStore, statisticStore, dagStore, interactionStore, authStore, userStore } = useStores();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    articleStore.fetchById(id);
    statisticStore.fetchById(id);
    dagStore.fetchDag([id]);
    if (authStore.isAuthenticated) {
      interactionStore.fetchTotal(id);
      interactionStore.view(id);
    }
  }, [id]);

  useEffect(() => {
    const article = articleStore.currentArticle;
    if (article) {
      userStore.fetchPublicUser(article.authorId);
    }
  }, [articleStore.currentArticle?.authorId]);

  if (!id) return <Typography>Invalid article ID</Typography>;
  if (articleStore.isLoading && !articleStore.currentArticle) {
    return <PageSpinner />;
  }

  const article = articleStore.currentArticle;
  if (!article) return <Typography>Article not found</Typography>;

  const author = userStore.users.get(article.authorId);
  const canEdit = authStore.isAuthenticated && ((authStore.user?.id === article.authorId) || authStore.isAdmin);

  const handleDelete = async () => {
    setDeleteDialogOpen(false);
    if(authStore.isAdmin){
      await articleStore.adminDelete(id);
    }else{
      await articleStore.delete(id);
    }
    navigate("/");
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        {article.title}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <Typography variant="subtitle2" color="text.secondary">
          Author:{" "}
          <Link component="button" onClick={() => navigate(`/user/${article.authorId}`)}>
            {author?.username ?? article.authorId}
          </Link>
        </Typography>
        <ArticleStats articleId={id} />
      </Box>

      {authStore.isAuthenticated && <ArticleActions articleId={id} />}

      <ArticleContent content={article.content} />
      <ArticleReferences links={article.links} />

      {dagStore.dag && dagStore.dag.nodes.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Knowledge Graph
          </Typography>
          <DagVisualizer dag={dagStore.dag} />
        </Box>
      )}

      {canEdit && (
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(authStore.isAdmin ? `/article/${id}/editAdmin` : `/article/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setDeleteDialogOpen(true)}>
            Delete
          </Button>
        </Box>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="Delete Article"
        message="Are you sure you want to delete this article?"
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
});

