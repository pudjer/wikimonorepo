import { useMemo, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { f } from "../lib";
import { PreviewRule } from "../store/stores/public/ArticlePreview";
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
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckIcon from '@mui/icons-material/Check'

import { InteractionComponent } from "./InteractionComponent";


type PreviewComponentProps = {
  id: string;
  onSelect?: (id: string) => void;
};

const PreviewComponentBase = ({ id, onSelect }: PreviewComponentProps) => {
  const { t } = useTranslation();
  const { data, isPending, error } = PreviewRule.useResolve(id);
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


  const values = useMemo(
    () =>
      data
        ? [
            { label: t('preview.dagPoints'), value: data.dagPoints, icon: <AccountTreeIcon sx={{width: 40, height: 30, stroke: "gold"}}/> },
            { label: t('preview.views'), value: data.views, icon: <VisibilityIcon/> },
            { label: t('preview.likes'), value: data.likes, icon: <ThumbUpIcon/> },
            { label: t('preview.learners'), value: data.learners, icon: <MenuBookIcon/> },
            { label: t('preview.masters'), value: data.masters, icon: <CheckIcon/>}
          ]
        : [],
    [data, t]
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
          {t('preview.failedLoad')}
        </Typography>
      </Box>
    );
  }

  return (
    <Card onMouseEnter={handleMouseEnter} sx={{ minWidth: 330, minHeight: 170}}>
      <Box onClick={handleSelect} sx={{ cursor: 'pointer' }}>
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Typography variant="h6">
              {data.title}
            </Typography>
            <Stack direction={"row"} sx={{width: 200, flexWrap: "wrap"}}>
              {values.map((item) => (
                <Chip
                  key={item.label}
                  icon={item.icon}
                  label={item.value}
                  size="small"
                  sx={{ margin: "3px" }}
                />
              ))}
            </Stack>
            {isHovered && (
              <Box onClick={(e) => e.stopPropagation()}> {/* Останавливаем всплытие */}
                <Suspense
                  fallback={
                    <Typography variant="body2" color="text.secondary">
                      {t('preview.loadingInteractions')}
                    </Typography>
                  }
                >
                  <InteractionComponent id={id} />
                </Suspense>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
};

export const PreviewComponent = f.observer(PreviewComponentBase);
