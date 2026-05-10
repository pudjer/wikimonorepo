import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Author } from "../../store/stores/public/Author";

export function AuthorMini({ author }: { author: Author }) {
  return (
    <Card variant="outlined">
      <CardActionArea component={RouterLink} to={`/author/${author.id}`}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
            {author.username}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

