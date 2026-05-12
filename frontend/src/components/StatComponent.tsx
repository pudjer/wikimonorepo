import { Paper, Box, Card, CardContent, Grid, Button, Typography } from "@mui/material";
import { LearningStats } from "../domain/learningDAG/stats";
import { PreviewComponent } from "./PreviewComponent";
import { TotalInteraction } from "../store";
import { f } from "../lib";
import React from "react";
import { useTranslation } from "react-i18next";

const StatComponentBase = ({stat, onSelect}: {stat: LearningStats<TotalInteraction>, onSelect?: (id: string)=>void}) => {
  const { t } = useTranslation()
  const isMastered = stat.isMastered();
  const isLearning = stat.isLearning();
  const isTransitiveMastered = stat.isTransitiveMastered();
  const isTransitiveLearning = stat.isTransitiveLearning();
  let backgroundColor = "#f0f0f0"; // Unknown
  if (isMastered) backgroundColor = "#00ff0d"; // Green
  else if (isLearning) backgroundColor = "#0008ff";   // Blue
  else if (isTransitiveMastered) backgroundColor = "#d6ffb0"; // Light green
  else if (isTransitiveLearning) backgroundColor = "#718bff"; // Light blue
  return (
    <Grid
      sx={{
        padding: 1,
        backgroundColor,
        borderRadius: 1,
        cursor: "pointer",
        size: "fit-content",
        minWidth: 350
      }}
    >
      <Box sx={{ mb: 2 }}>
        <PreviewComponent onSelect={onSelect} id={stat.value.articleId} />
      </Box>
      <Typography sx={{color: "black"}}>
        {stat.isTransitiveMastered() ? 100 : stat.getTransitiveAncestorsMasteringDegree() * 99}% {t("stats.learned")}
        {", "}
        {t("stats.requiredFor")}{" "}{stat.learningDescendantsCount}
      </Typography>
    </Grid>
  );
}

export const StatComponent = f.observer(StatComponentBase);