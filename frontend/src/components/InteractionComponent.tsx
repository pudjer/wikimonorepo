import { useCallback, useState } from "react";
import { f } from "../lib";
import mutationApi from "../api/mutationApi";
import { TotalInteractionRule } from "../store/stores/private/TotalInteractions";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { LearnProgressStage } from "backend/src/domain/interactionUserArticle/learnProgress/entity";
import { RootRule } from "../store";

type InteractionComponentProps = {
  id: string;
};

const InteractionComponentBase = ({ id }: InteractionComponentProps) => {
  const { data: root, isPending: rootPending, error: rootError } = RootRule.useResolve(true);
  const { data, isPending, error } = TotalInteractionRule.useResolve(root?.myId ? { articleId: id, myId: root.myId } : undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    if(root?.myId) await TotalInteractionRule.refresh({articleId: id, myId: root.myId});
  }, [root?.myId, id]);
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
  if (root && !root.myId) {
    return (
      <Typography variant="body2" color="text.secondary">
        Войдите, чтобы взаимодействовать со статьей
      </Typography>
    );
  }

  if (isPending) {
    return (
      <Box>
        <CircularProgress size={18} />
        <Typography variant="body2">Загрузка взаимодействий...</Typography>
      </Box>
    );
  }

  if (error || rootError || !data) {
    return (
      <Typography variant="body2" color="error">
        Не удалось получить данные взаимодействий
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
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
          size="small"
          displayEmpty
          sx={{color: color(data.learnProgressStage)}}
        >
          <MenuItem 
            value={LearnProgressStage.Unknown}
            sx={{ color: color(LearnProgressStage.Unknown) }}
          >
            Не начат
          </MenuItem>
          <MenuItem 
            value={LearnProgressStage.Learning}
            sx={{ color: color(LearnProgressStage.Learning) }}
          >
            В процессе
          </MenuItem>
          <MenuItem 
            value={LearnProgressStage.Mastered}
            sx={{ color: color(LearnProgressStage.Mastered) }}
          >
            Завершен
          </MenuItem>
        </Select>
      </Stack>
    </Stack>
  );
};
export const InteractionComponent = f.observer(InteractionComponentBase);
const color = (stage: LearnProgressStage) => {
  switch(stage) {
    case LearnProgressStage.Unknown:
      return 'gray';
    case LearnProgressStage.Learning:
      return 'blue';
    case LearnProgressStage.Mastered:
      return 'green';
  }
}