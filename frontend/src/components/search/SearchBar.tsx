import { useState, type FormEvent } from "react";
import { Paper, TextField, Button } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ placeholder = "Search query...", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ display: "flex", gap: 1, p: 2, mb: 3 }}>
      <TextField
        fullWidth
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" variant="contained" startIcon={<SearchIcon />}>
        Search
      </Button>
    </Paper>
  );
}

