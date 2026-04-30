import { observer } from "mobx-react-lite";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { StatsBuilder } from "../../domain/learningDAG/statsDag";
import type { IHasStage } from "../../domain/learningDAG/stats";

interface LearningDagStatsProps<T extends IHasStage> {
  statsBuilder: StatsBuilder<T>;
}

export const LearningDagStats = observer(function LearningDagStats<T extends IHasStage>({
  statsBuilder
}: LearningDagStatsProps<T>) {
  const layers = dag.getLayers();

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Learning DAG Stats
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Node ID</TableCell>
            <TableCell>Stage</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Transitive Score</TableCell>
            <TableCell>Ancestors Mastering</TableCell>
            <TableCell>Transitive Ancestors Mastering</TableCell>
            <TableCell>Mastered</TableCell>
            <TableCell>Learning</TableCell>
            <TableCell>Transitive Mastered</TableCell>
            <TableCell>Transitive Learning</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {layers.flatMap((layer, layerIdx) =>
            Array.from(layer).map((stats, idx) => (
              <TableRow key={`${layerIdx}-${idx}`}>
                <TableCell>{getNodeId(stats.value)}</TableCell>
                <TableCell>{stats.value.learnProgressStage}</TableCell>
                <TableCell>{stats.getScore().toFixed(2)}</TableCell>
                <TableCell>{stats.getTransitiveScore().toFixed(2)}</TableCell>
                <TableCell>{(stats.getAncestorsMasteringDegree() * 100).toFixed(0)}%</TableCell>
                <TableCell>
                  {(stats.getTransitiveAncestorsMasteringDegree() * 100).toFixed(0)}%
                </TableCell>
                <TableCell>{stats.isMastered() ? "Yes" : "No"}</TableCell>
                <TableCell>{stats.isLearning() ? "Yes" : "No"}</TableCell>
                <TableCell>{stats.isTransitiveMastered() ? "Yes" : "No"}</TableCell>
                <TableCell>{stats.isTransitiveLearning() ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

