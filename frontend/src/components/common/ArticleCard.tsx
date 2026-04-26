import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Chip,
  Skeleton,
} from "@mui/material";
import { Visibility, ThumbUp, School, EmojiEvents, Share } from "@mui/icons-material";
import { useStores } from "../../hooks/useStores";

export const ArticleCard = observer(function ArticleCard({ articleId }: { articleId: string }) {
  const { articleStore, statisticStore } = useStores();
  const navigate = useNavigate();
  const article = articleStore.articles.get(articleId);
  const stat = statisticStore.stats.get(articleId);

  if (!article) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" height={32} />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/article/${articleId}`)}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {article.content.slice(0, 120).replace(/\n/g, " ")}...
          </Typography>
          {stat && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip size="small" icon={<Visibility fontSize="small" />} label={stat.views} />
              <Chip size="small" icon={<ThumbUp fontSize="small" />} label={stat.likes} />
              <Chip size="small" icon={<School fontSize="small" />} label={stat.learners} />
              <Chip size="small" icon={<EmojiEvents fontSize="small" />} label={stat.masters} />
              <Chip size="small" icon={<Share fontSize="small" />} label={stat.dagPoints} />
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

