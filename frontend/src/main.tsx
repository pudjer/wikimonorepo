import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import App from "./App.tsx";
import { theme } from "./theme.ts";
import { StoreProvider } from "./components/StoreProvider.tsx";
import { rootStore } from "./stores/rootStore.ts";
async function init() {
  await rootStore.init();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <StoreProvider store={rootStore}>
            <App />
          </StoreProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

init();

