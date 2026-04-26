import { makeAutoObservable, runInAction } from "mobx";
import type { InteractionResultDto, LearnProgressStage } from "../api";
import { api } from "../api";
import type { UiStore } from "./uiStore";

export class InteractionStore {
  interactions = new Map<string, InteractionResultDto>();
  isLoading = false;
  ui: UiStore;

  constructor(ui: UiStore) {
    this.ui = ui;
    makeAutoObservable(this, { ui: false }, { autoBind: true });
  }

  async fetchTotal(articleId: string) {
    try {
      const data = await api.privateInteractionUserArticle.getTotal(articleId);
      runInAction(() => {
        this.interactions.set(articleId, data);
      });
    } catch (e: unknown) {
      // silently fail for interactions
      console.error(e);
    }
  }

  async like(articleId: string) {
    this.isLoading = true;
    try {
      await api.privateInteractionUserArticle.like(articleId);
      await this.fetchTotal(articleId);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to like";
      this.ui.showError(msg);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async unlike(articleId: string) {
    this.isLoading = true;
    try {
      await api.privateInteractionUserArticle.unlike(articleId);
      await this.fetchTotal(articleId);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to unlike";
      this.ui.showError(msg);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async view(articleId: string) {
    try {
      await api.privateInteractionUserArticle.view(articleId);
      await this.fetchTotal(articleId);
    } catch {
      // ignore
    }
  }

  async updateLearnProgress(articleId: string, stage: LearnProgressStage) {
    this.isLoading = true;
    try {
      await api.privateInteractionUserArticle.updateLearnProgress(articleId, { stage });
      await this.fetchTotal(articleId);
      this.ui.showSuccess("Progress updated");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update progress";
      this.ui.showError(msg);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

