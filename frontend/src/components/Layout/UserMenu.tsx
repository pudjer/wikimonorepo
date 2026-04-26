import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

interface UserMenuProps {
  onProfile: () => void;
  onLogout: () => void;
  onLogoutAll: () => void;
}

export function UserMenu({ onProfile, onLogout, onLogoutAll }: UserMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="large" color="inherit" onClick={handleMenu}>
        <AccountCircle />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onProfile();
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onLogout();
          }}
        >
          Logout
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onLogoutAll();
          }}
        >
          Logout All
        </MenuItem>
      </Menu>
    </>
  );
}

