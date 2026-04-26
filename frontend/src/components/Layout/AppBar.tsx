import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { NavButton } from "./NavButton";
import { UserMenu } from "./UserMenu";
import { useStores } from "../../hooks/useStores";

export const AppBar = observer(function AppBar() {
  const { authStore } = useStores();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authStore.logout();
    navigate("/");
  };

  const handleLogoutAll = async () => {
    await authStore.logoutAll();
    navigate("/");
  };

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
          StructedWiki
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <NavButton to="/search" startIcon={<SearchIcon />} onClick={() => navigate("/search")}>
            Search
          </NavButton>
          {authStore.isAuthenticated && (
            <NavButton to="/article/create" onClick={() => navigate("/article/create")}>
              Create Article
            </NavButton>
          )}
          {!authStore.isAuthenticated ? (
            <>
              <NavButton to="/login" onClick={() => navigate("/login")}>Login</NavButton>
              <NavButton to="/register" onClick={() => navigate("/register")}>Register</NavButton>
            </>
          ) : (
            <>
              {authStore.isAdmin && <NavButton to="/admin" onClick={() => navigate("/admin")}>Admin</NavButton>}
              <UserMenu
                onProfile={() => navigate("/profile")}
                onLogout={handleLogout}
                onLogoutAll={handleLogoutAll}
              />
            </>
          )}
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
});

