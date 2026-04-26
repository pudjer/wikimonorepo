import { Box, CircularProgress } from "@mui/material";

interface PageSpinnerProps {
  mt?: number;
}

export function PageSpinner({ mt = 4 }: PageSpinnerProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt }}>
      <CircularProgress />
    </Box>
  );
}

