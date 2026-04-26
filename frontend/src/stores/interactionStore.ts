import { makeAutoObservable, runInAction } from "mobx";
import type { InteractionResultDto, LearnProgressStage, LikeDto, ViewDto, LearnProgressDto } from "../api";
import { api } from "../api";
import type { UiStore } from "./uiStore";

export class InteractionStore {
  interactions = new Map<string, InteractionResultDto>();
  likes: LikeDto[] = [];
  views: ViewDto[] = [];
  learnProgress: LearnProgressDto[] = [];
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

  async fetchLikes() {
    try {
      const data = await api.privateInteractionUserArticle.getLikes();
      runInAction(() => {
        this.likes = data;
      });
    } catch (e: unknown) {
      console.error(e);
    }
  }

  async fetchViews() {
    try {
      const data = await api.privateInteractionUserArticle.getViews();
      runInAction(() => {
        this.views = data;
      });
    } catch (e: unknown) {
      console.error(e);
    }
  }

  async fetchLearnProgress() {
    try {
      const data = await api.privateInteractionUserArticle.getLearnProgress();
      runInAction(() => {
        this.learnProgress = data;
      });
    } catch (e: unknown) {
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
