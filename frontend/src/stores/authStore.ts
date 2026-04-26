import { makeAutoObservable, runInAction } from "mobx";
import type {
  LoginDto,
  UpdateInputDtoPrivate,
  UserOutputDtoPrivate,
  UserRegisterInputDtoPublic,
} from "../api";
import { api, RoleName } from "../api";
import type { UiStore } from "./uiStore";

export class AuthStore {
  user: UserOutputDtoPrivate | null = null;
  isLoading = false;
  ui: UiStore;

  refreshIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(ui: UiStore) {
    this.ui = ui;

    makeAutoObservable(
      this,
      {
        ui: false,
        refreshIntervalId: false,
      },
      {
        autoBind: true,
      }
    );
  }

  get isAuthenticated() {
    return this.user !== null;
  }

  isAdmin = false;

  async init() {
    await this.fetchCurrentUser();

    if (this.isAuthenticated) {
      this.startSessionRefresh();
    }
  }

  async fetchCurrentUser() {
    try {
      const user = await api.privateUser.get();

      runInAction(() => {
        this.user = user;
      });

      try {
        const adminUser = await api.adminUser.get(user.id);
        runInAction(() => {
          this.isAdmin = adminUser.role === RoleName.Admin;
        });
      } catch {
        runInAction(() => {
          this.isAdmin = false;
        });
      }
    } catch {
      runInAction(() => {
        this.user = null;
        this.isAdmin = false;
      });
    }
  }

  private startSessionRefresh() {
    if (this.refreshIntervalId) return;

    this.refreshIntervalId = setInterval(async () => {
      try {
        await api.session.refresh();
      } catch {
        this.stopSessionRefresh();

        runInAction(() => {
          this.user = null;
          this.isAdmin = false;
        });

        this.ui.showError("Session expired");
      }
    }, 1000 * 60 * 10); // каждые 10 минут
  }

  private stopSessionRefresh() {
    if (!this.refreshIntervalId) return;

    clearInterval(this.refreshIntervalId);
    this.refreshIntervalId = null;
  }

  async login(dto: LoginDto) {
    this.isLoading = true;

    try {
      await api.login.login(dto);
      await this.fetchCurrentUser();

      this.startSessionRefresh();

      this.ui.showSuccess("Logged in successfully");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed";
      this.ui.showError(msg);
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async register(dto: UserRegisterInputDtoPublic) {
    this.isLoading = true;

    try {
      await api.publicUser.register(dto);
      await this.login({
        username: dto.username,
        password: dto.password,
      });

      this.ui.showSuccess("Registered successfully");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Registration failed";
      this.ui.showError(msg);
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async logout() {
    this.stopSessionRefresh();

    try {
      await api.session.logout();
      this.ui.showSuccess("Logged out");
    } catch {
      // ignore
    } finally {
      runInAction(() => {
        this.user = null;
        this.isAdmin = false;
      });
    }
  }

  async logoutAll() {
    this.stopSessionRefresh();

    try {
      await api.session.logoutAll();
      this.ui.showSuccess("Logged out from all sessions");
    } catch {
      // ignore
    } finally {
      runInAction(() => {
        this.user = null;
        this.isAdmin = false;
      });
    }
  }

  async updateProfile(dto: UpdateInputDtoPrivate) {
    this.isLoading = true;

    try {
      const updated = await api.privateUser.update(dto);

      runInAction(() => {
        this.user = updated;
      });

      this.ui.showSuccess("Profile updated");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Update failed";
      this.ui.showError(msg);
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}