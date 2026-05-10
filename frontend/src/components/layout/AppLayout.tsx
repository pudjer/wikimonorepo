import { ReactNode } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";

export function AppLayout({ children }: { children?: ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppHeader />
      <Box component="main" sx={{ flex: 1, p: 2 }}>
        {children}
        <Outlet />

      </Box>
    </Box>
  );
}

