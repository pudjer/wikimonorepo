import { makeAutoObservable, runInAction } from "mobx";
import type { ArticleSearchResultDto } from "../api";
import { api } from "../api";
import type { UiStore } from "./uiStore";

export class SearchStore {
  query = "";
  results: ArticleSearchResultDto[] = [];
  isLoading = false;
  page = 1;
  size = 10;
  ui: UiStore;

  constructor(ui: UiStore) {
    this.ui = ui;
    makeAutoObservable(this, { ui: false }, { autoBind: true });
  }

  async search(q: string) {
    this.query = q;
    this.page = 1;
    this.isLoading = true;
    try {
      const data = await api.publicSearch.searchArticles({
        query: q,
        page: this.page,
        size: this.size,
      });
      runInAction(() => {
        this.results = data.results;
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Search failed";
      this.ui.showError(msg);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async searchInArticles(q: string, articleIds: string[]) {
    this.query = q;
    this.isLoading = true;
    try {
      const data = await api.publicSearch.searchInArticles({
        query: q,
        articleIds,
        page: this.page,
        size: this.size,
      });
      runInAction(() => {
        this.results = data.results;
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Search failed";
      this.ui.showError(msg);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

