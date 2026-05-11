import { Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Alert, Skeleton } from "@mui/material";
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { f } from "../../lib";
import { ArticleTitleComponent, ArticleContentComponent, ArticleLinksComponent, AuthorComponent, ArticlesDagComponent } from "../../components";
import { mutationApi } from "../../api/mutationApi";
import { RootRule } from "../../store";
import { ArticleRule } from "../../store/stores/public/ArticleFull";

export const ArticlePage = f.observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!id) return <Box>Article not found</Box>;

  const {
    data: article,
    isPending: isArticlePending,
    error: articleError,
  } = ArticleRule.useResolve(id);
  const {
    data: rootData,
    isPending: isRootPending,
  } = RootRule.useResolve(true);

  const isPending = isArticlePending || isRootPending;
  const isMy = !!rootData?.myId && article?.authorId === rootData.myId;

  const linksForComponent = useMemo(() => {
    if (!article) return [];
    return article.links.map(link => ({
      parentId: link.parent.id,
      name: link.name,
      parentTitle: link.parent.title
    }));
  }, [article]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await mutationApi.private.articles.delete(id);
      setIsDeleteDialogOpen(false);
      navigate("/trending");
    } catch (error) {
      console.error("Failed to delete article:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async () => {
    if (!article) return;

    try {
      setIsSubmitting(true);
      await mutationApi.private.articles.update(id, {
        title: article.title,
        content: article.content,
        links: article.links.map(link => ({
          name: link.name,
          parent: link.parent.id
        }))
      });
      await ArticleRule.refresh(id);
      setIsChanged(false);
    } catch (error) {
      console.error("Failed to update article:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={240} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={128} sx={{ mb: 2 }} />
      </Container>
    );
  }

  if (articleError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{articleError.message || "Failed to load article."}</Alert>
      </Container>
    );
  }

  if (!article) return <Box>Article not found</Box>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <ArticleTitleComponent 
          title={article.title} 
          isEditable={isMy} 
          onChange={() => setIsChanged(true)} 
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <ArticleContentComponent 
          content={article.content} 
          isEditable={isMy} 
          onChange={() => setIsChanged(true)} 
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <ArticleLinksComponent 
          links={linksForComponent}
          isEditable={isMy}
          onAddLink={() => setIsChanged(true)}
          onRemoveLink={() => setIsChanged(true)}
          onLinkNameChange={() => setIsChanged(true)}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <AuthorComponent id={article.authorId} />
      </Box>

      <Box sx={{ mb: 4 }}>
        <ArticlesDagComponent ids={[article.id]} />
      </Box>

      {isMy && (
        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          {isChanged && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          )}
          <Button
            variant="outlined"
            color="error"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Article
          </Button>
        </Box>
      )}

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Article</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this article? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
});
