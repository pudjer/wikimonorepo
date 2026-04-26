import { Typography, Box } from "@mui/material";

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = "Something went wrong." }: ErrorStateProps) {
  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography color="error" variant="h6">
        {message}
      </Typography>
    </Box>
  );
}

