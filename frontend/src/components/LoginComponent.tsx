import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { mutationApi } from "../api/mutationApi";
import { RootRule } from "../store";

interface LoginComponentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({ onSuccess, onCancel }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginPending, setLoginPending] = useState(false);

  const handleLogin = async () => {
    setLoginPending(true);
    try {
      setLoginError("");
      await mutationApi.public.login({ username, password });
      await RootRule.refresh(undefined);
      setUsername("");
      setPassword("");
      onSuccess?.();
      // Trigger refresh of RootRule
    } catch (error) {
      setLoginError("Failed to login. Please check your credentials.");
      console.error("Failed to login:", error);
    } finally {
      setLoginPending(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: 3,
        borderRadius: 1,
        minWidth: 300,
        boxShadow: 3,
      }}
    >
      <Box sx={{ mb: 2, fontSize: "1.2rem", fontWeight: "bold" }}>
        Login
      </Box>
      <Box sx={{ mb: 2 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxSizing: "border-box",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxSizing: "border-box",
          }}
        />
      </Box>
      {loginError && (
        <Box sx={{ color: "red", mb: 2, fontSize: "0.9rem" }}>
          {loginError}
        </Box>
      )}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          onClick={handleLogin}
          fullWidth
          disabled={loginPending}
        >
          {loginPending ? "Logging in..." : "Login"}
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          fullWidth
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};