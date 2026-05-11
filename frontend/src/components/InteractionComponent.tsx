import { useCallback, useState } from "react";
import { f } from "../lib";
import mutationApi from "../api/mutationApi";
import { TotalInteractionRule } from "../store/stores/private/TotalInteractions";
import {
  Box,
  Button,
  CircularProgress,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { LearnProgressStage } from "backend/src/domain/interactionUserArticle/learnProgress/entity";

type InteractionComponentProps = {
  id: string;
};

const InteractionComponentBase = ({ id }: InteractionComponentProps) => {
  const { data, isPending, error } = TotalInteractionRule.useResolve(id, [id]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    await TotalInteractionRule.refresh(id);
  }, [id]);

  const handleLikeToggle = async () => {
    if (!data) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (data.isLiked) {
        await mutationApi.private.interactionUserArticle.likes.unlike(id);
      } else {
        await mutationApi.private.interactionUserArticle.likes.like(id);
      }
      await refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewToggle = async () => {
    if (!data) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (data.isViewed) {
        await mutationApi.private.interactionUserArticle.views.removeView(id);
      } else {
        await mutationApi.private.interactionUserArticle.views.view(id);
      }
      await refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLearnProgressStageChange = async (newStage: LearnProgressStage) => {
    if (!data) {
      return;
    }

    setIsSubmitting(true);
    try {
      await mutationApi.private.interactionUserArticle.learnProgress.updateLearnProgress(id, {stage: newStage});
      await refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPending) {
    return (
      <Box>
        <CircularProgress size={18} />
        <Typography variant="body2">Загрузка взаимодействий...</Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Typography variant="body2" color="error">
        Не удалось получить данные взаимодействий
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      <Typography variant="body2">
        Просмотрено: {data.isViewed ? "да" : "нет"}
      </Typography>
      <Typography variant="body2">
        Лайк: {data.isLiked ? "да" : "нет"}
      </Typography>
      <Typography variant="body2">
        Этап обучения: {data.learnProgressStage ?? "не задан"}
      </Typography>
      <Stack direction="row" spacing={1} >
        <Button
          variant="outlined"
          onClick={handleLikeToggle}
          disabled={isSubmitting}
        >
          {data.isLiked ? "Убрать лайк" : "Поставить лайк"}
        </Button>
        <Button
          variant="outlined"
          onClick={handleViewToggle}
          disabled={isSubmitting}
        >
          {data.isViewed ? "Убрать просмотр" : "Отметить просмотр"}
        </Button>
        <Select
          value={data.learnProgressStage}
          onChange={(e) => handleLearnProgressStageChange(e.target.value as LearnProgressStage)}
          disabled={isSubmitting}
        >
          <option value={LearnProgressStage.Unknown}>Не начат</option>
          <option value={LearnProgressStage.Learning}>В процессе</option>
          <option value={LearnProgressStage.Mastered}>Завершен</option>
        </Select>
      </Stack>
    </Stack>
  );
};

export const InteractionComponent = f.observer(InteractionComponentBase);
