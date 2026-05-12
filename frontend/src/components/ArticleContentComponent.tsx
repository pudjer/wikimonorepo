import { f } from "../lib";
import { useTranslation } from "react-i18next";
import { Box, TextField, Typography } from "@mui/material";

type ArticleContentComponentProps = {
  content: string;
  isEditable?: boolean;
  onChange?: (value: string) => void;
};

const ArticleContentComponentBase = ({ content, isEditable, onChange }: ArticleContentComponentProps) => {
  const { t } = useTranslation();
  if (isEditable) {
    return (
      <Box>
        <TextField
          label={t('articleContent.content')}
          value={content}
          onChange={(event) => onChange?.(event.target.value)}
          fullWidth
          multiline
          minRows={8}
          variant="outlined"
          margin="normal"
        />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body1">
        {content || t('articleContent.noContent')}
      </Typography>
    </Box>
  );
};

export const ArticleContentComponent = f.observer(ArticleContentComponentBase);
