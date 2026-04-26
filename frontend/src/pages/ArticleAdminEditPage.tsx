import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { ArticleForm } from "../components/form/ArticleForm";
import { PageSpinner } from "../components/common/PageSpinner";
import { PageTitle } from "../components/common/PageTitle";
import { useStores } from "../hooks/useStores";
import type { ArticleReferenceDto } from "../api";

export const ArticleAdminEditPage = observer(function ArticleEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articleStore } = useStores();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!id) return;
    articleStore.fetchById(id).then(() => setReady(true));
  }, [id]);

  if (!id) return <Typography>Invalid article ID</Typography>;
  if (!ready || (articleStore.isLoading && !articleStore.currentArticle)) {
    return <PageSpinner />;
  }

  const article = articleStore.currentArticle;
  if (!article) return <Typography>Article not found</Typography>;

  const handleSubmit = async (data: { title: string; content: string; links: ArticleReferenceDto[] }) => {
    const dto: { title?: string; content?: string; links?: ArticleReferenceDto[] } = {};
    if (data.title !== article.title) dto.title = data.title;
    if (data.content !== article.content) dto.content = data.content;
    const originalLinks = article.links;
    const linksChanged =
      data.links.length !== originalLinks.length ||
      data.links.some((l, i) => l.name !== originalLinks[i]?.name || l.parent !== originalLinks[i]?.parent);
    if (linksChanged) dto.links = data.links;

    await articleStore.adminUpdate(id, dto);
    navigate(`/article/${id}`);
  };

  return (
    <>
      <PageTitle>Edit Article</PageTitle>
      <ArticleForm
        initialTitle={article.title}
        initialContent={article.content}
        initialLinks={article.links}
        submitLabel="Save"
        isLoading={articleStore.isLoading}
        onSubmit={handleSubmit}
      />
    </>
  );
});

