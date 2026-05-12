import { Box, Container, Grid, Alert, Skeleton, Stack, Button } from "@mui/material";
import { f } from "../../lib";
import { RootRule, MeRule, TotalInteraction, MyLearningStatsRule } from "../../store";
import { StatComponent } from "../../components/StatComponent";
import { VisualizeDag } from "../../components";
import { useMemo } from "react";

export const LearningDagPage = f.observer(() => {
  const { data: root, isPending: isRootPending, error: rootError } = RootRule.useResolve(true);
  const { data: learningStats, isPending: isStatsPending, error } = MyLearningStatsRule.useResolve(root?.myId);
  const isPending = isRootPending || isStatsPending;

  const handleRefresh = async () => {
    if(root?.myId) await MyLearningStatsRule.refresh(root.myId);
  }
  const NodeComponent = useMemo(() => ({ node }: { node: TotalInteraction }) => <StatComponent stat={learningStats!.getStats(node)} />, [learningStats]);

  if (isPending) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={180} sx={{ mb: 2 }} />
      </Container>
    );
  }

  if (rootError || error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{(rootError || error)!.message || "Failed to load learning data."}</Alert>
      </Container>
    );
  }

  if (!learningStats) {
    return <Box>No learning stats available.</Box>;
  }

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, height: "80vh", display: "flex", flexDirection: "column" }}>
      Learning DAG
      <VisualizeDag NodeComponent={NodeComponent} dag={learningStats.dag} getKey={node=>node.articleId}/>
      <Button onClick={handleRefresh} sx={{ mt: 2 }} variant="contained" color="primary">Refresh DAG</Button>

      <Box sx={{ mt: 4 }}>
        Learning Path
        <Stack direction="row" spacing={2}>
          <Box sx={{display: "flex"}}>
            {learningStats.getAllStats().filter(stat=>stat.getTransitiveScore()).toSorted((a, b) => b.getTransitiveScore() - a.getTransitiveScore()).map((stat) => <StatComponent key={stat.value.articleId} stat={stat}/>)}
          </Box>
        </Stack>
      </Box>
    </Container>
  );
});
