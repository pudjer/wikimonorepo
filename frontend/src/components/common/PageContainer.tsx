import type { ReactNode } from "react";
import { Box } from "@mui/material";

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: number | string;
}

export function PageContainer({ children, maxWidth = 960 }: PageContainerProps) {
  return (
    <Box sx={{ maxWidth, mx: "auto", width: "100%" }}>
      {children}
    </Box>
  );
}

