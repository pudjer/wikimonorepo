import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { f } from "../../lib";
import { RootRule } from "../../store/stores/Root";

export const ProfilePage = f.observer(function ProfilePage() {
  const navigate = useNavigate();
  const root = RootRule.useResolve(undefined);
  console.log("render ProfilePage", root.data?.me);
  const me = root.data?.me ?? null;

  if (!root.isPending && !me) {
    // auth guard
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Profile
        </Typography>
        {root.isPending ? (
          <Typography>Loading...</Typography>
        ) : me ? (
          <Typography>
            id: {me.profile.id} • username: {me.profile.username}
          </Typography>
        ) : null}
      </Paper>
    </Box>
  );
});

