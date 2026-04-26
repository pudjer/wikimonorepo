import type { ReactNode } from "react";
import { Typography } from "@mui/material";

interface PageTitleProps {
  children: ReactNode;
}

export function PageTitle({ children }: PageTitleProps) {
  return (
    <Typography variant="h4" gutterBottom>
      {children}
    </Typography>
  );
}

