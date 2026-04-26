import { Typography, Box } from "@mui/material";

export function NotFoundPage() {
  return (
    <Box sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h2" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary">
        Page not found
      </Typography>
    </Box>
  );
}

