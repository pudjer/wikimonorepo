import { observer } from "mobx-react-lite";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";
import { AuthForm } from "../components/form/AuthForm";
import { useStores } from "../hooks/useStores";

export const LoginPage = observer(function LoginPage() {
  const { authStore } = useStores();
  const navigate = useNavigate();

  const handleSubmit = async (username: string, password: string) => {
    await authStore.login({ username, password });
    navigate("/");
  };

  return (
    <AuthForm
      title="Login"
      submitLabel="Login"
      loadingLabel="Logging in..."
      isLoading={authStore.isLoading}
      onSubmit={handleSubmit}
      extraButton={
        <Button component={RouterLink} to="/register" variant="text" fullWidth>
          Don&apos;t have an account? Register
        </Button>
      }
    />
  );
});

