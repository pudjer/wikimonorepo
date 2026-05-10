import { Box, Paper, Stack, Typography, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { f } from "../../lib";
import { InOrderRule, type OrderColonOrderBy } from "../../store/stores/public/InOrder";
import { ArticlePreviewMini } from "../../components/public/ArticlePreviewMini";


export const RankingPage = f.observer(function RankingPage() {
  const [ordering, setOrdering] = useState<OrderColonOrderBy>("DESC:learners");

  const res = InOrderRule.useResolve(ordering);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Ranking
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Typography color="text.secondary">Sort:</Typography>
          <Select
            size="small"
            value={ordering}
            onChange={(e) => setOrdering(e.target.value as OrderColonOrderBy)}
          >
            <MenuItem value={"DESC:learners"}>learners</MenuItem>
            <MenuItem value={"DESC:views"}>views</MenuItem>
            <MenuItem value={"DESC:likes"}>likes</MenuItem>
          </Select>
        </Stack>

        {res.isPending ? <Typography>Loading...</Typography> : null}
        {res.data ? (
          <Stack spacing={2}>
            {res.data.map((p) => (
              <ArticlePreviewMini key={p.id} article={p} />
            ))}
          </Stack>
        ) : null}
      </Paper>
    </Box>
  );
});

