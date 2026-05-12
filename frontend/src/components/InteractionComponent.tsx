import { useCallback, useState } from "react";
import { f } from "../lib";
import mutationApi from "../api/mutationApi";
import { TotalInteractionRule } from "../store/stores/private/TotalInteractions";
import {
  Box,
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
import { LearnProgressStage } from "backend/src/domain/interactionUserArticle/learnProgress/entity";
import { RootRule } from "../store";
import { useTranslation } from "react-i18next";
import CheckIcon from '@mui/icons-material/Check'

type InteractionComponentProps = {
  id: string;
};

const InteractionComponentBase = ({ id }: InteractionComponentProps) => {
  const { t } = useTranslation();
  const { data: root, isPending: rootPending, error: rootError } = RootRule.useResolve(true);
  const { data, isPending, error } = TotalInteractionRule.useResolve(root?.myId ? { articleId: id, myId: root.myId } : undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    if (root?.myId) {
      await TotalInteractionRule.refresh({ articleId: id, myId: root.myId });
    }
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
      await mutationApi.private.interactionUserArticle.learnProgress.updateLearnProgress(id, { stage: newStage });
      await refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (root && !root.myId) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t("interaction.signInToInteract")}
      </Typography>
    );
  }

  if (isPending) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={18} />
        <Typography variant="body2">{t("interaction.loading")}</Typography>
      </Box>
    );
  }

  if (error || rootError || !data) {
    return (
      <Typography variant="body2" color="error">
        {t("interaction.failedLoad")}
      </Typography>
    );
  }

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <IconButton onClick={handleLikeToggle} disabled={isSubmitting} color={data.isLiked ? "primary" : "default"}>
          {data.isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
        </IconButton>

        <IconButton onClick={handleViewToggle} disabled={isSubmitting} color={data.isViewed ? "primary" : "default"}>
          {data.isViewed ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>

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
                bgcolor: 'rgba(128, 128, 128, 0.16)',
                color: color(LearnProgressStage.Unknown),
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value={LearnProgressStage.Learning}
            sx={{
              color: color(LearnProgressStage.Learning),
              '&.Mui-selected': {
                bgcolor: 'rgba(88, 166, 255, 0.16)',
                color: color(LearnProgressStage.Learning),
              },
            }}
          >
            <MenuBookIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value={LearnProgressStage.Mastered}
            sx={{
              color: color(LearnProgressStage.Mastered),
              '&.Mui-selected': {
                bgcolor: 'rgba(63, 185, 80, 0.16)',
                color: color(LearnProgressStage.Mastered),
              },
            }}
          >
            <CheckIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
};

export const InteractionComponent = f.observer(InteractionComponentBase);

const color = (stage: LearnProgressStage) => {
  switch (stage) {
    case LearnProgressStage.Unknown:
      return "gray";
    case LearnProgressStage.Learning:
      return "#58a6ff";
    case LearnProgressStage.Mastered:
      return "#3fb950";
  }
};
