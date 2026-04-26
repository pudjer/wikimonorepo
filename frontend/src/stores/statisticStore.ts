import { makeAutoObservable, runInAction } from "mobx";
import { Order, OrderingProp } from "../api";
import type { ArticleStatisticResultDTO } from "../api";
import { api } from "../api";
import type { UiStore } from "./uiStore";

export class StatisticStore {
  stats = new Map<string, ArticleStatisticResultDTO>();
  topStats: ArticleStatisticResultDTO[] = [];
  isLoading = false;
  ui: UiStore;

  constructor(ui: UiStore) {
    this.ui = ui;
    makeAutoObservable(this, { ui: false }, { autoBind: true });
  }

  async fetchById(id: string) {
    this.isLoading = true;
    try {
      const stat = await api.publicArticleStatistic.getById(id);
      runInAction(() => {
        this.stats.set(id, stat);
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load statistic";
      this.ui.showError(msg);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchByIds(ids: string[]) {
    if (ids.length === 0) return;
    this.isLoading = true;
    try {
      const data = await api.publicArticleStatistic.getByIds({ ids });
      runInAction(() => {
        for (const s of data.statistics) {
          this.stats.set(s.articleId, s);
        }
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load statistics";
      this.ui.showError(msg);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchTop(order: Order = Order.DESC, orderingProp: OrderingProp = OrderingProp.views) {
    this.isLoading = true;
    try {
      const data = await api.publicArticleStatistic.getInOrder({ order, orderingProp });
      runInAction(() => {
        this.topStats = data.statistics.slice(0, 10);
        for (const s of data.statistics) {
          this.stats.set(s.articleId, s);
        }
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load top statistics";
      this.ui.showError(msg);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

