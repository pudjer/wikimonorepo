import { makeAutoObservable, runInAction } from "mobx";
import type { ArticleDAGResultDTO } from "../api";
import { api } from "../api";
import type { UiStore } from "./uiStore";

export class DagStore {
  dag: ArticleDAGResultDTO | null = null;
  isLoading = false;
  ui: UiStore;

  constructor(ui: UiStore) {
    this.ui = ui;
    makeAutoObservable(this, { ui: false }, { autoBind: true });
  }

  async fetchDag(ids: string[]) {
    if (ids.length === 0) return;
    this.isLoading = true;
    try {
      const data = await api.publicArticleDAG.getDAG(ids);
      runInAction(() => {
        this.dag = data;
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load DAG";
      this.ui.showError(msg);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  clear() {
    this.dag = null;
  }
}

