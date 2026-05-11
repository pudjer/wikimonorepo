import { useState, ChangeEvent } from "react";
import { f } from "../lib";
import { Box, TextField, Typography } from "@mui/material";

type ArticleContentComponentProps = {
  content: string;
  isEditable?: boolean;
  onChange?: (value: string) => void;
};

const ArticleContentComponentBase = ({ content, isEditable, onChange }: ArticleContentComponentProps) => {
  const [value, setValue] = useState(content);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    onChange?.(nextValue);
  };

  if (isEditable) {
    return (
      <Box>
        <TextField
          label="Содержимое"
          value={value}
          onChange={handleChange}
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
        {content || "Контент отсутствует"}
      </Typography>
    </Box>
  );
};

export const ArticleContentComponent = f.observer(ArticleContentComponentBase);
