import { f } from "../lib";
import { Box, TextField, Typography } from "@mui/material";

type ArticleTitleComponentProps = {
  title: string;
  isEditable?: boolean;
  onChange?: (value: string) => void;
};

const ArticleTitleComponentBase = ({ title, isEditable, onChange }: ArticleTitleComponentProps) => {
  if (isEditable) {
    return (
      <Box>
        <TextField
          label="Заголовок"
          value={title}
          onChange={(event) => onChange?.(event.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1">
        {title || "Без названия"}
      </Typography>
    </Box>
  );
};

export const ArticleTitleComponent = f.observer(ArticleTitleComponentBase);
