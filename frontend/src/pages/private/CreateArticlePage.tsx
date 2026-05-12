import { Box, Container, Button, TextField, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { f } from "../../lib";
import { ArticleLinksComponent } from "../../components";
import { mutationApi } from "../../api/mutationApi";

type ArticleLinkInfo = {
  parentId: string;
  name: string;
};

export const CreateArticlePage = f.observer(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [links, setLinks] = useState<ArticleLinkInfo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddLink = (parentId: string) => {
    if (!links.some(link => link.parentId === parentId)) {
      setLinks([...links, { parentId, name: "extends" }]);
    }
  };

  const handleRemoveLink = (parentId: string) => {
    setLinks(links.filter(link => link.parentId !== parentId));
  };

  const handleLinkNameChange = (parentId: string, name: string) => {
    setLinks(links.map(link =>
      link.parentId === parentId ? { ...link, name } : link
    ));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const result = await mutationApi.private.articles.create({
        title,
        content,
        links: links.map(link => ({
          name: link.name,
          parent: link.parentId
        }))
      });
      navigate(`/article/${result.id}`);
    } catch (error) {
      console.error("Failed to create article:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <TextField
          label={t("createArticle.titleLabel")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          label={t("createArticle.contentLabel")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          fullWidth
          multiline
          rows={10}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <ArticleLinksComponent
          links={links}
          isEditable
          onAddLink={handleAddLink}
          onRemoveLink={handleRemoveLink}
          onLinkNameChange={handleLinkNameChange}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? <CircularProgress size={24} /> : t("createArticle.createButton")}
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/trending")}
          disabled={isSubmitting}
        >
          {t("createArticle.cancelButton")}
        </Button>
      </Box>
    </Container>
  );
});

