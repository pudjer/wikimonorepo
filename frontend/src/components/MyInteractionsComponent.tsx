import { useMemo } from "react";
import { f } from "../lib";
import { MyInteractionsRule, RootRule } from "../store";
import { PreviewListComponent } from "./PreviewListComponent";
import { LearnProgressStage } from "backend/src/domain/interactionUserArticle/learnProgress/entity";
import { Box, CircularProgress, Divider, Stack, Typography } from "@mui/material";

type MyInteractionsComponentProps = {
  onSelect?: (id: string) => void;
};

const MyInteractionsComponentBase = ({ onSelect }: MyInteractionsComponentProps) => {
  const { data: root } = RootRule.useResolve(true);
  const { data, isPending, error } = MyInteractionsRule.useResolve(root?.myId);

  const likedIds = useMemo(
    () => data?.filter((interaction) => interaction.isLiked).map((interaction) => interaction.articleId) ?? [],
    [data]
  );

  const viewedIds = useMemo(
    () => data?.filter((interaction) => interaction.isViewed).map((interaction) => interaction.articleId) ?? [],
    [data]
  );

  const learningIds = useMemo(
    () =>
      data
        ?.filter(
          (interaction) =>
            interaction.learnProgressStage !== LearnProgressStage.Unknown
        )
        .map((interaction) => interaction.articleId) ?? [],
    [data]
  );

  if (isPending) {
    return (
      <Stack spacing={1}>
        <CircularProgress size={24} />
        <Typography>Загрузка ваших взаимодействий...</Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        Не удалось загрузить ваши взаимодействия
      </Typography>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h6">Мои взаимодействия</Typography>

      <Box>
        <Typography variant="subtitle1">Лайки</Typography>
        {likedIds.length > 0 ? (
          <PreviewListComponent horizontal ids={likedIds} onSelect={onSelect} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Нет отмеченных лайков
          </Typography>
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle1">Просмотры</Typography>
        {viewedIds.length > 0 ? (
          <PreviewListComponent horizontal ids={viewedIds} onSelect={onSelect} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Нет отмеченных просмотров
          </Typography>
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle1">Обучение</Typography>
        {learningIds.length > 0 ? (
          <PreviewListComponent horizontal ids={learningIds} onSelect={onSelect} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Нет статей в стадии обучения
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

export const MyInteractionsComponent = f.observer(MyInteractionsComponentBase);
