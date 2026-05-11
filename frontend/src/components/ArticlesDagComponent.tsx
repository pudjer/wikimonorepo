import { f } from "../lib";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { PreviewListComponent } from "./PreviewListComponent";

type ArticlesDagComponentProps = {
  ids: string[];
};

const ArticlesDagComponentBase = ({ ids }: ArticlesDagComponentProps) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Заготовка графа статей
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Визуализация графа реализуется позже. Сейчас отображается список связанных статей.
        </Typography>
        {ids.length > 0 ? (
          <Box>
            <PreviewListComponent ids={ids} />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Нет идентификаторов для отображения в графе.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export const ArticlesDagComponent = f.observer(ArticlesDagComponentBase);
