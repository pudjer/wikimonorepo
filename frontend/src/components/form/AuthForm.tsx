import { useState, type FormEvent } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";

interface AuthFormProps {
  title: string;
  submitLabel: string;
  loadingLabel: string;
  isLoading: boolean;
  onSubmit: (username: string, password: string) => void | Promise<void>;
  extraButton?: React.ReactNode;
}

export function AuthForm({ title, submitLabel, loadingLabel, isLoading, onSubmit, extraButton }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" size="large" disabled={isLoading}>
            {isLoading ? loadingLabel : submitLabel}
          </Button>
          {extraButton}
        </Box>
      </Paper>
    </Box>
  );
}

