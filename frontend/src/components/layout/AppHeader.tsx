import { useMemo } from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { f } from "../../lib";
import { RootRule } from "../../store/stores/Root";
import api from "../../api";

export const AppHeader = f.observer(function AppHeader() {
  const navigate = useNavigate();

  const root = RootRule.useResolve(undefined);
  const me = root.data?.me ?? null;

  const authButtons = useMemo(() => {
    if (me) {
      return (
        <Button
          color="inherit"
          onClick={async () => {
            await api.session.logout();
            await RootRule.refresh(undefined);
            navigate("/login");
          }}
        >
          Logout
        </Button>
      );
    }

    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
        <Button color="inherit" component={Link} to="/register">
          Register
        </Button>
      </Box>
    );
  }, [me, navigate]);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          StructedWiki
        </Typography>

        {me ? (
          <Button color="inherit" component={Link} to="/profile">
            Profile
          </Button>
        ) : null}

        {authButtons}
      </Toolbar>
    </AppBar>
  );
});

