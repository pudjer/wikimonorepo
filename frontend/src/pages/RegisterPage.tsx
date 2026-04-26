import { observer } from "mobx-react-lite";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";
import { AuthForm } from "../components/form/AuthForm";
import { useStores } from "../hooks/useStores";

export const RegisterPage = observer(function RegisterPage() {
  const { authStore } = useStores();
  const navigate = useNavigate();

  const handleSubmit = async (username: string, password: string) => {
    await authStore.register({ username, password });
    navigate("/");
  };

  return (
    <AuthForm
      title="Register"
      submitLabel="Register"
      loadingLabel="Registering..."
      isLoading={authStore.isLoading}
      onSubmit={handleSubmit}
      extraButton={
        <Button component={RouterLink} to="/login" variant="text" fullWidth>
          Already have an account? Login
        </Button>
      }
    />
  );
});

