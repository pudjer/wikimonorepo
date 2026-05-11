import { Box, AppBar, Toolbar, Button, IconButton, Menu, MenuItem, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { f } from "../lib";
import { RootRule } from "../store";
import { SearchComponent } from "./SearchComponent";
import { LoginComponent } from "./LoginComponent";
import { mutationApi } from "../api/mutationApi";

const HeaderComponentBase = () => {
  const navigate = useNavigate();
  const {data: root, error, isPending} = RootRule.useResolve(undefined);
  if (error) {
    console.error("Failed to load user data:", error);
  }
  const isSignedIn = !!root?.me;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setLogoutPending(true);
    try {
      await mutationApi.private.session.logout();
      await RootRule.refresh(undefined);
      handleProfileMenuClose();
      // Trigger refresh of RootRule
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      setLogoutPending(false);
    }
  };

  const handleSearchSelect = (id: string) => {
    navigate(`/article/${id}`);
  };

  const handleNavClick = () => {
    if (isSignedIn) {
      navigate("/learning-dag");
    } else {
      navigate("/trending");
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
        <Button
          color="inherit"
          sx={{ textTransform: "none", fontSize: "1.2rem", fontWeight: "bold" }}
          onClick={handleNavClick}
        >
          {isSignedIn ? "Learning DAG" : "Trending"}
        </Button>

        <Box sx={{ flex: 1, maxWidth: 400 }}>
          <SearchComponent
            placeholder="Search articles..."
            onSelect={handleSearchSelect}
          />
        </Box>

        <Box>
          {isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : error ? (
            <Button color="inherit" disabled>
              Error loading user
            </Button>
          ) : isSignedIn ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
                size="large"
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem onClick={() => navigate(`/author/${root?.me?.profile.id}`)}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} disabled={logoutPending}>
                  {logoutPending ? "Logging out..." : "Logout"}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => setLoginOpen(true)}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Login Modal */}
      {loginOpen && !isSignedIn && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
          }}
          onClick={() => setLoginOpen(false)}
        >
          <LoginComponent
            onCancel={() => setLoginOpen(false)}
          />
        </Box>
      )}
    </AppBar>
  );
};

export const HeaderComponent = f.observer(HeaderComponentBase);
