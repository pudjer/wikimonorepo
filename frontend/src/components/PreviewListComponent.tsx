import { f } from "../lib";
import { useTranslation } from "react-i18next";
import { ArticlePreviewCollectionRule } from "../store/stores/public/ArticlePreview";
import { PreviewComponent } from "./PreviewComponent";
import { Box, Skeleton, Stack, Typography } from "@mui/material";

type PreviewListComponentProps = {
  ids: string[];
  onSelect?: (id: string) => void;
  horizontal?: boolean;
};

const PreviewListComponentBase = ({ 
  ids, 
  onSelect, 
  horizontal = false 
}: PreviewListComponentProps) => {
  const { t } = useTranslation();
  const { data, isPending, error } = ArticlePreviewCollectionRule.useResolve(ids);

  if (isPending) {
    return (
      <Stack 
        direction={horizontal ? "row" : "column"} 
        spacing={2}
        sx={{
          ...(horizontal 
            ? { overflowX: 'auto' } 
            : { maxHeight: '70vh', overflowY: 'auto' }
          )
        }}
      >
        {[1, 2, 3].map((index) => (
          <Box 
            key={index} 
            sx={horizontal 
              ? { minWidth: 280, flexShrink: 0 } 
              : { flexShrink: 0 }
            }
          >
            <Skeleton width="100%" height={112} />
          </Box>
        ))}
      </Stack>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        {t('previewList.failedLoad')}
      </Typography>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('previewList.noArticles')}
      </Typography>
    );
  }

  return (
    <Stack 
      direction={horizontal ? "row" : "column"} 
      spacing={2}
      sx={{
        ...(horizontal 
          ? { overflowX: 'auto' } 
          : { maxHeight: '70vh', overflowY: 'auto' }
        )
      }}
    >
      {data.map((preview) => (
        <Box 
          key={preview.id} 
          sx={horizontal 
            ? { minWidth: 300, maxWidth: 400, flexShrink: 0 } 
            : { flexShrink: 0 }
          }
        >
          <PreviewComponent id={preview.id} onSelect={onSelect} />
        </Box>
      ))}
    </Stack>
  );
};

export const PreviewListComponent = f.observer(PreviewListComponentBase);