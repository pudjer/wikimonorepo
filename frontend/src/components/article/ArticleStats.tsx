import { observer } from "mobx-react-lite";
import { Box, Chip } from "@mui/material";
import { Visibility, ThumbUp, School, EmojiEvents, Share } from "@mui/icons-material";
import { useStores } from "../../hooks/useStores";

interface ArticleStatsProps {
  articleId: string;
}

export const ArticleStats = observer(function ArticleStats({ articleId }: ArticleStatsProps) {
  const { statisticStore } = useStores();
  const stat = statisticStore.stats.get(articleId);

  if (!stat) return null;

  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      <Chip size="small" icon={<Visibility fontSize="small" />} label={stat.views} />
      <Chip size="small" icon={<ThumbUp fontSize="small" />} label={stat.likes} />
      <Chip size="small" icon={<School fontSize="small" />} label={stat.learners} />
      <Chip size="small" icon={<EmojiEvents fontSize="small" />} label={stat.masters} />
      <Chip size="small" icon={<Share fontSize="small" />} label={stat.dagPoints} />
    </Box>
  );
});

