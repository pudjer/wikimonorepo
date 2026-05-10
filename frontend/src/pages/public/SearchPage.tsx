import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { f } from "../../lib";
import type { ArticleQueryDto as ArticleQueryDtoType } from "../../api";
import { SearchPreviews } from "../../store/stores/public/SearchPreviews";
import { ArticlePreviewMini } from "../../components/public/ArticlePreviewMini";

export const SearchPage = f.observer(function SearchPage() {
  const [query, setQuery] = useState("");

  const effectiveDto: ArticleQueryDtoType = useMemo(() => {
    return { query } as ArticleQueryDtoType;
  }, [query]);

  const [records, setRecords] = useState<Awaited<ReturnType<typeof SearchPreviews>>>([]);
  const [isPending, setIsPending] = useState(false);

  const run = async () => {
    setIsPending(true);
    try {
      const r = await SearchPreviews(effectiveDto);
      setRecords(r);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Search
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ alignItems: { xs: "stretch", sm: "center" } }}
        >
          <TextField label="Query" value={query} onChange={(e) => setQuery(e.target.value)} fullWidth />
          <Button variant="contained" onClick={run} disabled={isPending}>
            {isPending ? "Searching..." : "Search"}
          </Button>
        </Stack>

        <Box sx={{ mt: 3 }}>
          {records.length === 0 && !isPending ? (
            <Typography color="text.secondary">No results.</Typography>
          ) : null}

          <Stack spacing={2}>
            {records.map((r) => (
              <ArticlePreviewMini
                key={r.preview.id}
                article={r.preview}
                relevanceScore={r.info.relevanceScore}
                snippet={r.info.contentSnippet}
              />
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
});

