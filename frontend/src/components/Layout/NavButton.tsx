import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";

interface NavButtonProps {
  to: string;
  children: React.ReactNode;
  startIcon?: React.ReactNode;
  onClick?: () => void;
}

export function NavButton({ to, children, startIcon, onClick }: NavButtonProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Button
      color="inherit"
      onClick={onClick}
      startIcon={startIcon}
      sx={{ fontWeight: isActive ? "bold" : "normal" }}
    >
      {children}
    </Button>
  );
}

