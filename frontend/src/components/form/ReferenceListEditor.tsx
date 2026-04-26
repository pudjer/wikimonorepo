import { Box, TextField, IconButton, Button, Paper, Typography } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import type { ArticleReferenceDto } from "../../api";

interface ReferenceListEditorProps {
  links: ArticleReferenceDto[];
  onChange: (links: ArticleReferenceDto[]) => void;
}

export function ReferenceListEditor({ links, onChange }: ReferenceListEditorProps) {
  const addLink = () => {
    onChange([...links, { name: "", parent: "" }]);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof ArticleReferenceDto, value: string) => {
    onChange(links.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        References
      </Typography>
      {links.map((link, idx) => (
        <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
          <TextField
            label="Name"
            size="small"
            value={link.name}
            onChange={(e) => updateLink(idx, "name", e.target.value)}
            required
          />
          <TextField
            label="Parent Article ID"
            size="small"
            value={link.parent}
            onChange={(e) => updateLink(idx, "parent", e.target.value)}
            required
          />
          <IconButton color="error" onClick={() => removeLink(idx)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button variant="outlined" startIcon={<AddIcon />} onClick={addLink}>
        Add Reference
      </Button>
    </Paper>
  );
}

