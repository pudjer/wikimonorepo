import { observer } from "mobx-react-lite";
import { Box, Button } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useStores } from "../../hooks/useStores";
import { LearnProgressStage } from "../../api";

interface ArticleActionsProps {
  articleId: string;
}

export const ArticleActions = observer(function ArticleActions({ articleId }: ArticleActionsProps) {
  const { interactionStore } = useStores();
  const interaction = interactionStore.interactions.get(articleId);

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
      <Button
        variant="outlined"
        size="small"
        startIcon={interaction?.isLiked ? <Favorite /> : <FavoriteBorder />}
        onClick={() =>
          interaction?.isLiked ? interactionStore.unlike(articleId) : interactionStore.like(articleId)
        }
      >
        {interaction?.isLiked ? "Unlike" : "Like"}
      </Button>
      <Button
        variant={interaction?.learnProgressStage === LearnProgressStage.Learning ? "contained" : "outlined"}
        size="small"
        onClick={() => interactionStore.updateLearnProgress(articleId, LearnProgressStage.Learning)}
      >
        Learning
      </Button>
      <Button
        variant={interaction?.learnProgressStage === LearnProgressStage.Mastered ? "contained" : "outlined"}
        size="small"
        onClick={() => interactionStore.updateLearnProgress(articleId, LearnProgressStage.Mastered)}
      >
        Mastered
      </Button>
    </Box>
  );
});

