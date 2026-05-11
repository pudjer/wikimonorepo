import { Box, Container, Grid, Alert, Skeleton, Stack } from "@mui/material";
import { f } from "../../lib";
import { InteractionComponent, PreviewComponent, PreviewListComponent, VisualizeDag } from "../../components";
import { RootRule, MeRule, TotalInteraction } from "../../store";
import { StatComponent } from "../../components/StatComponent";
import { LearningStats } from "../../domain/learningDAG/stats";

export const LearningDagPage = f.observer(() => {
  const { data: root, isPending: isRootPending, error: rootError } = RootRule.useResolve(true);
  const { data: me, isPending: isMePending, error } = MeRule.useResolve(root?.myId);
  const isPending = isRootPending || isMePending;
  const learningStats = me?.myLearningStats;


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
  const NodeComponent = ({ node }: { node: TotalInteraction }) => <StatComponent stat={learningStats.getStats(node)} />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ fontSize: "1.5rem", fontWeight: "bold", mb: 3 }}>
          Learning DAG
        </Box>
        <VisualizeDag dag={learningStats.dag} NodeComponent={NodeComponent} />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2 }}>
          Articles by Score
        </Box>
        <Stack direction="row" spacing={2}>
          <Box sx={{display: "flex"}}>
            {learningStats.getAllStats().toSorted((a, b) => b.getTransitiveScore() - a.getTransitiveScore()).map((stat) => <StatComponent key={stat.value.a} stat={stat} />)}
          </Box>
        </Stack>
      </Box>
    </Container>
  );
});
