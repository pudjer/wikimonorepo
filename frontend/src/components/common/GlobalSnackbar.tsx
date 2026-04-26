import { observer } from "mobx-react-lite";
import { Snackbar, Alert } from "@mui/material";
import { useStores } from "../../hooks/useStores";

export const GlobalSnackbar = observer(function GlobalSnackbar() {
  const { uiStore } = useStores();
  return (
    <Snackbar
      open={uiStore.snackbarOpen}
      autoHideDuration={4000}
      onClose={uiStore.closeSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity={uiStore.snackbarSeverity} onClose={uiStore.closeSnackbar}>
        {uiStore.snackbarMessage}
      </Alert>
    </Snackbar>
  );
});

