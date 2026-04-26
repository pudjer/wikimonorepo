import { Typography } from "@mui/material";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No data yet." }: EmptyStateProps) {
  return (
    <Typography color="text.secondary">
      {message}
    </Typography>
  );
}

