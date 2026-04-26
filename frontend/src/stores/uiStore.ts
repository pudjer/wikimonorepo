import { makeAutoObservable } from "mobx";

export class UiStore {
  snackbarOpen = false;
  snackbarMessage = "";
  snackbarSeverity: "success" | "error" | "info" | "warning" = "info";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  showSuccess(message: string) {
    this.snackbarMessage = message;
    this.snackbarSeverity = "success";
    this.snackbarOpen = true;
  }

  showError(message: string) {
    this.snackbarMessage = message;
    this.snackbarSeverity = "error";
    this.snackbarOpen = true;
  }

  showInfo(message: string) {
    this.snackbarMessage = message;
    this.snackbarSeverity = "info";
    this.snackbarOpen = true;
  }

  closeSnackbar() {
    this.snackbarOpen = false;
  }
}

