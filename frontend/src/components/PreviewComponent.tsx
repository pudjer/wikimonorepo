import { useMemo, useState, Suspense } from "react";
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
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SchoolIcon from '@mui/icons-material/School';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { InteractionComponent } from "./InteractionComponent";


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
            { label: "Просмотры", value: data.views, icon: <VisibilityIcon fontSize="small" /> },
            { label: "Лайки", value: data.likes, icon: <ThumbUpIcon fontSize="small" /> },
            { label: "Учащихся", value: data.learners, icon: <SchoolIcon fontSize="small" /> },
            { label: "Очки графа", value: data.dagPoints, icon: <AutoGraphIcon fontSize="small" /> },
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
    <Card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ minWidth: 330, minHeight: 200}}>
      <Box onClick={handleSelect} sx={{ cursor: 'pointer' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {data.title}
          </Typography>
          <AuthorComponent id={data.authorId} />
          <Stack direction="row" spacing={1}>
            {values.map((item) => (
              <Tooltip key={item.label} title={item.label}>
                <Chip
                  icon={item.icon}
                  label={item.value}
                  size="small"
                  sx={{ minWidth: 64 }}
                />
              </Tooltip>
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
