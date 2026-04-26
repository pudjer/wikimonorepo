import { useState, type FormEvent } from "react";
import { Box, TextField, Button, Paper } from "@mui/material";
import { ReferenceListEditor } from "./ReferenceListEditor";
import type { ArticleReferenceDto } from "../../api";

interface ArticleFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialLinks?: ArticleReferenceDto[];
  submitLabel: string;
  isLoading: boolean;
  onSubmit: (data: { title: string; content: string; links: ArticleReferenceDto[] }) => void | Promise<void>;
}

export function ArticleForm({
  initialTitle = "",
  initialContent = "",
  initialLinks = [],
  submitLabel,
  isLoading,
  onSubmit,
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [links, setLinks] = useState<ArticleReferenceDto[]>(initialLinks.map((l) => ({ ...l })));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, links });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          label="Title"
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Content"
          fullWidth
          required
          multiline
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Paper>

      <ReferenceListEditor links={links} onChange={setLinks} />

      <Button type="submit" variant="contained" size="large" disabled={isLoading}>
        {submitLabel}
      </Button>
    </Box>
  );
}

