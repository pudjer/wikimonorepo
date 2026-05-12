import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Input } from "@mui/material";
import { useTranslation } from "react-i18next";
import { mutationApi } from "../api/mutationApi";
import { RootRule } from "../store";

interface LoginComponentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginPending, setLoginPending] = useState(false);

  const handleLogin = async () => {
    setLoginPending(true);
    try {
      setLoginError("");
      await mutationApi.public.login({ username, password });
      await RootRule.refresh(true);
      setUsername("");
      setPassword("");
      onSuccess?.();
    } catch (error) {
      setLoginError(t("login.failedMessage"));
      console.error("Failed to login:", error);
    } finally {
      setLoginPending(false);
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        backgroundColor: "background.paper",
        padding: 3,
        borderRadius: 3,
        minWidth: 320,
        maxWidth: 420,
        width: "100%",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        {t("login.title")}
      </Typography>
      <Box sx={{ mb: 2, display: "grid", gap: 2 }}>
        <TextField
          label={t("login.username")}
          variant="filled"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          slotProps={
            {input: { disableUnderline: true }}
          }
          sx={{ backgroundColor: "action.hover", borderRadius: 2 }}
        />
        <TextField
          label={t("login.password")}
          variant="filled"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          slotProps={
            {input: { disableUnderline: true }}
          }
          sx={{ backgroundColor: "action.hover", borderRadius: 2 }}
        />
      </Box>
      {loginError && (
        <Typography color="error" sx={{ mb: 2, fontSize: "0.95rem" }}>
          {loginError}
        </Typography>
      )}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Button variant="contained" onClick={handleLogin} fullWidth disabled={loginPending}>
          {loginPending ? t("login.loggingIn") : t("login.login")}
        </Button>
        <Button variant="outlined" onClick={onCancel} fullWidth>
          {t("login.cancel")}
        </Button>
      </Box>
    </Paper>
  );
};
