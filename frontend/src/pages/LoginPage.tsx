import { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { RootRule } from "../store/stores/Root";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <Box sx={{ maxWidth: 420, mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Login
        </Typography>

        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error ? (
          <Typography color="error" sx={{ mt: 1, mb: 1 }}>
            {error}
          </Typography>
        ) : null}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={submitting}
          onClick={async () => {
            setSubmitting(true);
            setError(null);
            try {
              await api.login.login({ username, password });
              await RootRule.refresh(undefined);
              navigate("/profile");
            } catch {
              setError("Login failed");
            } finally {
              setSubmitting(false);
            }

          }}
        >
          {submitting ? "Logging in..." : "Login"}
        </Button>
      </Paper>
    </Box>
  );
}

