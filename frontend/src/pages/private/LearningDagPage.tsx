import { Box, Container, Grid, Paper, Card, CardContent, Alert, Skeleton } from "@mui/material";
import { useMemo } from "react";
import { f } from "../../lib";
import { PreviewComponent, PreviewListComponent } from "../../components";
import { RootRule, MeRule } from "../../store";
import { LearnProgressStage } from "backend/src/domain/interactionUserArticle/learnProgress/entity";

export const LearningDagPage = f.observer(() => {
  const { data: root, isPending: isRootPending, error } = RootRule.useResolve(true);
  const { data: me, isPending: isMePending } = MeRule.useResolve(root?.myId);
  const isPending = isRootPending || isMePending;
  const learningStats = me?.myLearningStats;

  const allStats = useMemo(() => {
    if (!learningStats) return [];
    const stats = learningStats.getAllStats();
    return stats.sort((a, b) => {
      // Get transitive score if available
      const scoreA = a.getTransitiveScore();
      const scoreB = b.getTransitiveScore();
      return scoreB - scoreA;
    });
  }, [learningStats]);

  const previewIds = useMemo(() => {
    return allStats.map(stat => stat.value.articleId);
  }, [allStats]);

  if (isPending) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={180} sx={{ mb: 2 }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error.message || "Failed to load learning data."}</Alert>
      </Container>
    );
  }

  if (!learningStats) {
    return <Box>No learning stats available.</Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ fontSize: "1.5rem", fontWeight: "bold", mb: 3 }}>
          Learning DAG
        </Box>

        <Grid container spacing={3}>
          {allStats.map((stat) => {
            const isMastered = stat.value.learnProgressStage === LearnProgressStage.Mastered;
            const isLearning = stat.value.learnProgressStage === LearnProgressStage.Learning;
            const isTransitiveMastered = stat.isTransitiveMastered();
            const isTransitiveLearning = stat.isTransitiveLearning();

            let backgroundColor = "#f0f0f0"; // Unknown
            if (isMastered) backgroundColor = "#4caf50"; // Green
            else if (isLearning) backgroundColor = "#2196f3"; // Blue
            else if (isTransitiveMastered) backgroundColor = "#c8e6c9"; // Light green
            else if (isTransitiveLearning) backgroundColor = "#bbdefb"; // Light blue

            return (
              <Grid key={stat.value.articleId}>
                <Paper
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
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ fontSize: "0.875rem", mb: 1 }}>
                        <strong>Transitive Score:</strong> {stat.getTransitiveScore()}
                      </Box>
                      <Box sx={{ fontSize: "0.875rem", mb: 1 }}>
                        <strong>Learning Descendants:</strong> {stat.learningDescendantsCount.value}
                      </Box>
                      <Box sx={{ fontSize: "0.875rem" }}>
                        <strong>Mastered Ancestors:</strong> {stat.masteredAncestorsCount.value}
                      </Box>
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2 }}>
          Articles by Score
        </Box>
        {previewIds.length > 0 && <PreviewListComponent ids={previewIds} />}
      </Box>
    </Container>
  );
});

