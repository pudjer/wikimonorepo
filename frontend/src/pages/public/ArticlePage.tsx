import { Box, Container, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Alert, Skeleton } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { f } from "../../lib";
import { ArticleTitleComponent, ArticleContentComponent, ArticleLinksComponent, AuthorComponent, ArticlesDagComponent } from "../../components";
import { mutationApi } from "../../api/mutationApi";
import { RootRule, TotalInteractionRule } from "../../store";
import { ArticleRule } from "../../store/stores/public/ArticleFull";

type ArticleLinkInfo = {
  parentId: string;
  name: string;
};

export const ArticlePage = f.observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [links, setLinks] = useState<ArticleLinkInfo[]>([]);

  if (!id) return <Box>{t("article.notFound")}</Box>;

  const {
    data: article,
    isPending: isArticlePending,
    error: articleError,
  } = ArticleRule.useResolve(id);
  const {
    data: rootData,
    isPending: isRootPending,
  } = RootRule.useResolve(true);

  useEffect(() => {
    if (!article) {
      return;
    }
    setTitle(article.title);
    setContent(article.content);
    setLinks(
      article.links.map((link) => ({
        parentId: link.parent.id,
        name: link.name,
      }))
    );
    setIsChanged(false);
  }, [article]);

  useEffect(() => {
    const view = async () =>{
      if(!rootData?.myId) return
      await mutationApi.private.interactionUserArticle.views.view(id)
      await TotalInteractionRule.refresh({articleId: id, myId: rootData.myId})
    }
    view()
  }, [id, rootData?.myId])

  const isPending = isArticlePending || isRootPending;
  const isMy = !!rootData?.myId && article?.authorId === rootData.myId;

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
        title,
        content,
        links: links.map((link) => ({
          name: link.name,
          parent: link.parentId,
        })),
      });
      await ArticleRule.refresh(id);
      setIsChanged(false);
    } catch (error) {
      console.error("Failed to update article:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLink = (parentId: string) => {
    if (links.some((link) => link.parentId === parentId)) {
      return;
    }

    setLinks((prev) => [...prev, { parentId, name: "extends" }]);
    setIsChanged(true);
  };

  const handleRemoveLink = (parentId: string) => {
    setLinks((prev) => prev.filter((link) => link.parentId !== parentId));
    setIsChanged(true);
  };

  const handleLinkNameChange = (parentId: string, name: string) => {
    setLinks((prev) =>
      prev.map((link) =>
        link.parentId === parentId ? { ...link, name } : link
      )
    );
    setIsChanged(true);
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
        <Alert severity="error">{articleError.message || t("article.failedLoadArticle")}</Alert>
      </Container>
    );
  }

  if (!article) return <Box>{t("article.notFound")}</Box>;

  return (
    <Container sx={{ py: 4 }}>

      <Box sx={{ mb: 4 }}>
        <AuthorComponent id={article.authorId} />
      </Box>

      <Box sx={{ mb: 4 }}>
        <ArticleTitleComponent
          title={title}
          isEditable={isMy}
          onChange={(value) => {
            setTitle(value);
            setIsChanged(true);
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <ArticleContentComponent
          content={content}
          isEditable={isMy}
          onChange={(value) => {
            setContent(value);
            setIsChanged(true);
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <ArticleLinksComponent
          links={links}
          isEditable={isMy}
          onAddLink={handleAddLink}
          onRemoveLink={handleRemoveLink}
          onLinkNameChange={handleLinkNameChange}
        />
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
              {isSubmitting ? t("article.saving") : t("article.saveChanges")}
            </Button>
          )}
          <Button
            variant="outlined"
            color="error"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            {t("article.deleteArticle")}
          </Button>
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        <ArticlesDagComponent ids={[article.id]} />
      </Box>
      
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>{t("article.deleteConfirmTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("article.deleteConfirmMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>
            {t("article.cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? t("article.deleting") : t("article.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
});
