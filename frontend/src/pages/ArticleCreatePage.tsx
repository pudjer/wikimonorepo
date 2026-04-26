import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { ArticleForm } from "../components/form/ArticleForm";
import { PageTitle } from "../components/common/PageTitle";
import { useStores } from "../hooks/useStores";

export const ArticleCreatePage = observer(function ArticleCreatePage() {
  const { articleStore } = useStores();
  const navigate = useNavigate();

  const handleSubmit = async (data: { title: string; content: string; links: import("../api").ArticleReferenceDto[] }) => {
    const article = await articleStore.create(data);
    navigate(`/article/${article.id}`);
  };

  return (
    <>
      <PageTitle>Create Article</PageTitle>
      <ArticleForm submitLabel="Create" isLoading={articleStore.isLoading} onSubmit={handleSubmit} />
    </>
  );
});

