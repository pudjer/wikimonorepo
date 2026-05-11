import {  useState, ChangeEvent } from "react";
import { f } from "../lib";
import { Box, TextField, Typography } from "@mui/material";

type ArticleTitleComponentProps = {
  title: string;
  isEditable?: boolean;
  onChange?: (value: string) => void;
};

const ArticleTitleComponentBase = ({ title, isEditable, onChange }: ArticleTitleComponentProps) => {
  const [value, setValue] = useState(title);


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    onChange?.(nextValue);
  };

  if (isEditable) {
    return (
      <Box>
        <TextField
          label="Заголовок"
          value={value}
          onChange={handleChange}
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
