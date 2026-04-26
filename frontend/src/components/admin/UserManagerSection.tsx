import { useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useStores } from "../../hooks/useStores";
import { RoleName } from "../../api";

export const UserManagerSection = observer(function UserManagerSection() {
  const { userStore } = useStores();
  const [userIdInput, setUserIdInput] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRole, setAdminRole] = useState<RoleName>(RoleName.Base);

  const adminUser = userIdInput ? userStore.adminUsers.get(userIdInput) : undefined;

  const handleFetchUser = () => {
    if (userIdInput) userStore.fetchAdminUser(userIdInput);
  };

  const handleUpdateUser = async () => {
    if (!userIdInput) return;
    const dto: { username?: string; password?: string; role?: RoleName } = {};
    if (adminUsername) dto.username = adminUsername;
    if (adminPassword) dto.password = adminPassword;
    if (adminRole) dto.role = adminRole;
    await userStore.adminUpdateUser(userIdInput, dto);
  };

  const handleRegisterUser = async () => {
    await userStore.adminRegisterUser({
      username: adminUsername,
      password: adminPassword,
      role: adminRole,
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Manage User
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          label="User ID"
          size="small"
          value={userIdInput}
          onChange={(e) => setUserIdInput(e.target.value)}
        />
        <Button variant="outlined" onClick={handleFetchUser}>
          Fetch
        </Button>
      </Box>
      {userStore.isLoading && <CircularProgress size={24} />}
      {adminUser && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            {adminUser.username} <Chip size="small" label={adminUser.role} />
          </Typography>
        </Box>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: 400 }}>
        <TextField
          label="New Username"
          size="small"
          value={adminUsername}
          onChange={(e) => setAdminUsername(e.target.value)}
        />
        <TextField
          label="New Password"
          type="password"
          size="small"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />
        <TextField
          label="Role"
          size="small"
          select
          slotProps={{ select: { native: true } }}
          value={adminRole}
          onChange={(e) => setAdminRole(e.target.value as RoleName)}
        >
          <option value={RoleName.Base}>Base</option>
          <option value={RoleName.Admin}>Admin</option>
        </TextField>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={handleUpdateUser}>
            Update User
          </Button>
          <Button variant="outlined" onClick={handleRegisterUser}>
            Register New User
          </Button>
        </Box>
      </Box>
    </Paper>
  );
});

