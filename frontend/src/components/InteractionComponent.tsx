import { useCallback, useState } from "react";
import { f } from "../lib";
import mutationApi from "../api/mutationApi";
import { TotalInteractionRule } from "../store/stores/private/TotalInteractions";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from "@mui/material";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
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
    if (!data) return;
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
    if (!data) return;
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
    if (!data || newStage === data.learnProgressStage) return;
    setIsSubmitting(true);
    try {
      await mutationApi.private.interactionUserArticle.learnProgress.updateLearnProgress(id, {stage: newStage});
      await refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Tooltip title={data.isLiked ? "Убрать лайк" : "Поставить лайк"}>
          <IconButton
            onClick={handleLikeToggle}
            disabled={isSubmitting}
            color={data.isLiked ? "primary" : "default"}
          >
            {data.isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title={data.isViewed ? "Убрать просмотр" : "Отметить просмотр"}>
          <IconButton
            onClick={handleViewToggle}
            disabled={isSubmitting}
            color={data.isViewed ? "primary" : "default"}
          >
            {data.isViewed ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </Tooltip>

        <ToggleButtonGroup
          value={data.learnProgressStage}
          exclusive
          onChange={(_, newStage) => {
            if (newStage !== null) {
              handleLearnProgressStageChange(newStage);
            }
          }}
          size="small"
          disabled={isSubmitting}
          sx={{ ml: 1 }}
        >
          <ToggleButton 
            value={LearnProgressStage.Unknown}
            sx={{ 
              color: color(LearnProgressStage.Unknown),
              '&.Mui-selected': { 
                bgcolor: `light${color(LearnProgressStage.Unknown)}`,
                color: color(LearnProgressStage.Unknown)
              }
            }}
          >
            <Tooltip title="Не начат">
              <CloseIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton 
            value={LearnProgressStage.Learning}
            sx={{ 
              color: color(LearnProgressStage.Learning),
              '&.Mui-selected': { 
                bgcolor: `light${color(LearnProgressStage.Learning)}`,
                color: color(LearnProgressStage.Learning)
              }
            }}
          >
            <Tooltip title="В процессе">
              <MenuBookIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton 
            value={LearnProgressStage.Mastered}
            sx={{ 
              color: color(LearnProgressStage.Mastered),
              '&.Mui-selected': { 
                bgcolor: `light${color(LearnProgressStage.Mastered)}`,
                color: color(LearnProgressStage.Mastered)
              }
            }}
          >
            <Tooltip title="Завершен">
              <AutoAwesomeIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
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