import { createTheme, PaletteMode } from "@mui/material";

const commonPalette = {
  primary: {
    main: "#58a6ff",
    contrastText: "#0b1a34",
  },
  secondary: {
    main: "#79c0ff",
    contrastText: "#0b1a34",
  },
  error: {
    main: "#f85149",
  },
  success: {
    main: "#3fb950",
  },
};

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...commonPalette,
      background: {
        default: mode === "dark" ? "#0d1117" : "#f4f7ff",
        paper: mode === "dark" ? "#161b22" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#c9d1d9" : "#111827",
        secondary: mode === "dark" ? "#8b949e" : "#6b7280",
      },
      divider: mode === "dark" ? "#30363d" : "#e5e7eb",
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "rgba(15, 23, 42, 0.92)" : "#ffffff",
            borderBottom: `1px solid ${mode === "dark" ? "#30363d" : "#e5e7eb"}`,
            backdropFilter: "blur(12px)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: mode === "dark" ? "#c9d1d9" : "#111827",
          },
        },
      },
    },
  });

