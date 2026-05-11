import { useMemo } from "react";
import { f } from "../lib";
import { AuthorsArticlesRule } from "../store/stores/public/AuthorsArticles";
import { PreviewListComponent } from "./PreviewListComponent";
import { CircularProgress, Stack, Typography } from "@mui/material";

type AuthorArticlesComponentProps = {
  authorId: string;
  onSelect?: (id: string) => void;
};

const AuthorArticlesComponentBase = ({ authorId, onSelect }: AuthorArticlesComponentProps) => {
  const { data, isPending, error } = AuthorsArticlesRule.useResolve(authorId);
  const articleIds = useMemo(() => data?.map((preview) => preview.id) ?? [], [data]);

  if (isPending) {
    return (
      <Stack spacing={1}>
        <CircularProgress size={24} />
        <Typography>Загрузка статей автора...</Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        Не удалось загрузить статьи автора
      </Typography>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        У автора пока нет опубликованных статей
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Статьи автора</Typography>
      <PreviewListComponent ids={articleIds} onSelect={onSelect} />
    </Stack>
  );
};

export const AuthorArticlesComponent = f.observer(AuthorArticlesComponentBase);
