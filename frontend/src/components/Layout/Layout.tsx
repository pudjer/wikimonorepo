import { Outlet } from "react-router-dom";
import { Container, Box } from "@mui/material";
import { AppBar } from "./AppBar";
import { GlobalSnackbar } from "../common/GlobalSnackbar";

export function Layout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar />
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
      <GlobalSnackbar />
    </Box>
  );
}

