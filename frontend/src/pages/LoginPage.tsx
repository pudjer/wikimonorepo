import React from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoginComponent } from "../components";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <LoginComponent
        onSuccess={() => navigate("/learning-dag")}
        onCancel={() => navigate("/trending")}
      />
    </Box>
  );
};