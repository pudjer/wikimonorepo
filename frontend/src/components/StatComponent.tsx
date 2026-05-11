import { Paper, Box, Card, CardContent, Grid } from "@mui/material";
import { LearningStats } from "../domain/learningDAG/stats";
import { PreviewComponent } from "./PreviewComponent";
import { TotalInteraction } from "../store";
import { f } from "../lib";

const StatComponentBase = ({stat}: {stat: LearningStats<TotalInteraction>}) => {
  const isMastered = stat.isMastered();
  const isLearning = stat.isLearning();
  const isTransitiveMastered = stat.isTransitiveMastered();
  const isTransitiveLearning = stat.isTransitiveLearning();
  let backgroundColor = "#f0f0f0"; // Unknown
  if (isMastered) backgroundColor = "#4caf50"; // Green
  else if (isLearning) backgroundColor = "#2196f3";   // Blue
  else if (isTransitiveMastered) backgroundColor = "#c8e6c9"; // Light green
  else if (isTransitiveLearning) backgroundColor = "#bbdefb"; // Light blue

  return (
    <Grid
      sx={{
        p: 2,
        backgroundColor,
        borderRadius: 1,
        cursor: "pointer",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)"
        }
      }}
    >
      <Box sx={{ mb: 2 }}>
        <PreviewComponent id={stat.value.articleId} />
      </Box>
    </Grid>
  );
}

export const StatComponent = f.observer(StatComponentBase);