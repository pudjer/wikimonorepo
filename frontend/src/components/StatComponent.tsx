import { Paper, Box, Card, CardContent, Grid, Button } from "@mui/material";
import { LearningStats } from "../domain/learningDAG/stats";
import { PreviewComponent } from "./PreviewComponent";
import { TotalInteraction } from "../store";
import { f } from "../lib";
import React from "react";

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
        padding: 1,
        backgroundColor,
        borderRadius: 1,
        cursor: "pointer",
        size: "fit-content",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <PreviewComponent id={stat.value.articleId} />
      </Box>
    </Grid>
  );
}

export const StatComponent = f.observer(StatComponentBase);