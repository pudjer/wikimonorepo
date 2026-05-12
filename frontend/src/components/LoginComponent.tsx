import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, FormControlLabel, Switch } from "@mui/material";
import { useTranslation } from "react-i18next";
import { mutationApi } from "../api/mutationApi";
import { RootRule } from "../store";
import { RoleName } from "backend/src/domain/user/roles";

interface LoginComponentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginPending, setLoginPending] = useState(false);

  const handleSubmit = async () => {
    setLoginPending(true);
    try {
      setLoginError("");

      if (isRegister) {
        await mutationApi.public.user.register({
          username,
          password,
        });
      }

      await mutationApi.public.login({ username, password });
      await RootRule.refresh(true);
      setUsername("");
      setPassword("");
      onSuccess?.();
    } catch (error) {
      setLoginError(isRegister ? t("login.registerFailedMessage") : t("login.failedMessage"));
      console.error("Failed to submit login/register:", error);
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
        {isRegister ? t("login.titleRegister") : t("login.title")}
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={isRegister}
            onChange={(event) => setIsRegister(event.target.checked)}
            color="primary"
          />
        }
        label={isRegister ? t("login.switchToLogin") : t("login.switchToRegister")}
        sx={{ mb: 2 }}
      />
      <Box sx={{ mb: 2, display: "grid", gap: 2 }}>
        <TextField
          label={t("login.username")}
          variant="filled"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          slotProps={{ input: { disableUnderline: true } }}
          sx={{ backgroundColor: "action.hover", borderRadius: 2 }}
        />
        <TextField
          label={t("login.password")}
          variant="filled"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          slotProps={{ input: { disableUnderline: true } }}
          sx={{ backgroundColor: "action.hover", borderRadius: 2 }}
        />
      </Box>
      {loginError && (
        <Typography color="error" sx={{ mb: 2, fontSize: "0.95rem" }}>
          {loginError}
        </Typography>
      )}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          disabled={loginPending || !username || !password}
        >
          {loginPending
            ? isRegister
              ? t("login.registering")
              : t("login.loggingIn")
            : isRegister
            ? t("login.register")
            : t("login.login")}
        </Button>
        <Button variant="outlined" onClick={onCancel} fullWidth>
          {t("login.cancel")}
        </Button>
      </Box>
    </Paper>
  );
};
