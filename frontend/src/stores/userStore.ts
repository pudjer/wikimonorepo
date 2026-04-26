import { makeAutoObservable, runInAction } from "mobx";
import type { UserOutputDtoPublic, UserOutputDtoAdmin, UserUpdateInputDtoAdmin, UserRegisterInputDtoAdmin } from "../api";
import { api } from "../api";
import type { UiStore } from "./uiStore";

export class UserStore {
  users = new Map<string, UserOutputDtoPublic>();
  adminUsers = new Map<string, UserOutputDtoAdmin>();
  isLoading = false;
  ui: UiStore;

  constructor(ui: UiStore) {
    this.ui = ui;
    makeAutoObservable(this, { ui: false }, { autoBind: true });
  }

  async fetchPublicUser(userId: string) {
    this.isLoading = true;
    try {
      const user = await api.publicUser.get(userId);
      runInAction(() => {
        this.users.set(userId, user);
      });
      return user;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load user";
      this.ui.showError(msg);
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchAdminUser(userId: string) {
    this.isLoading = true;
    try {
      const user = await api.adminUser.get(userId);
      runInAction(() => {
        this.adminUsers.set(userId, user);
      });
      return user;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load user";
      this.ui.showError(msg);
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async adminUpdateUser(userId: string, dto: UserUpdateInputDtoAdmin) {
    this.isLoading = true;
    try {
      const user = await api.adminUser.update(userId, dto);
      runInAction(() => {
        this.adminUsers.set(userId, user);
      });
      this.ui.showSuccess("User updated");
      return user;
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

  async adminRegisterUser(dto: UserRegisterInputDtoAdmin) {
    this.isLoading = true;
    try {
      const user = await api.adminUser.register(dto);
      runInAction(() => {
        this.adminUsers.set(user.id, user);
      });
      this.ui.showSuccess("User registered");
      return user;
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
}

