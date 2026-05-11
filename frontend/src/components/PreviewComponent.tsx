import { useMemo, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { f } from "../lib";
import { ArticlePreviewRule } from "../store/stores/public/ArticlePreview";
import { AuthorComponent } from "./AuthorComponent";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

const InteractionComponent = lazy(
  () => import("./InteractionComponent").then((module) => ({ default: module.InteractionComponent }))
);

type PreviewComponentProps = {
  id: string;
  onSelect?: (id: string) => void;
};

const PreviewComponentBase = ({ id, onSelect }: PreviewComponentProps) => {
  const { data, isPending, error } = ArticlePreviewRule.useResolve(id);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleSelect = () => {
    if (typeof onSelect === "function") {
      onSelect(id);
      return;
    }

    navigate(`/article/${id}`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const values = useMemo(
    () =>
      data
        ? [
            { label: "Просмотры", value: data.views },
            { label: "Лайки", value: data.likes },
            { label: "Учащихся", value: data.learners },
          ]
        : [],
    [data]
  );

  if (isPending) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Skeleton width="60%" height={24} />
            <Skeleton width="40%" height={20} />
            <Skeleton width="100%" height={16} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Box>
        <Typography variant="body2" color="error">
          Не удалось загрузить превью статьи
        </Typography>
      </Box>
    );
  }

  return (
    <Card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ minWidth: 300, minHeight: 300}}>
      <Box onClick={handleSelect} sx={{ cursor: 'pointer' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {data.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {data.id}
          </Typography>
          <AuthorComponent id={data.authorId} />
          <Stack direction="row" spacing={1}>
            {values.map((item) => (
              <Chip key={item.label} label={`${item.label}: ${item.value}`} size="small" />
            ))}
          </Stack>
          {isHovered && (
            <Box onClick={(e) => e.stopPropagation()}> {/* Останавливаем всплытие */}
              <Suspense
                fallback={
                  <Typography variant="body2" color="text.secondary">
                    Загружается информация о взаимодействиях...
                  </Typography>
                }
              >
                <InteractionComponent id={id} />
              </Suspense>
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
};

export const PreviewComponent = f.observer(PreviewComponentBase);
