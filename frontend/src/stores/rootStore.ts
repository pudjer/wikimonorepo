import { AuthStore } from "./authStore";
import { ArticleStore } from "./articleStore";
import { SearchStore } from "./searchStore";
import { UserStore } from "./userStore";
import { InteractionStore } from "./interactionStore";
import { DagStore } from "./dagStore";
import { StatisticStore } from "./statisticStore";
import { UiStore } from "./uiStore";

export class RootStore {
  uiStore: UiStore;
  authStore: AuthStore;
  articleStore: ArticleStore;
  searchStore: SearchStore;
  userStore: UserStore;
  interactionStore: InteractionStore;
  dagStore: DagStore;
  statisticStore: StatisticStore;

  constructor() {
    this.uiStore = new UiStore();
    this.authStore = new AuthStore(this.uiStore);
    this.articleStore = new ArticleStore(this.uiStore);
    this.searchStore = new SearchStore(this.uiStore);
    this.userStore = new UserStore(this.uiStore);
    this.interactionStore = new InteractionStore(this.uiStore);
    this.dagStore = new DagStore(this.uiStore);
    this.statisticStore = new StatisticStore(this.uiStore);
  }

  async init() {
    await this.authStore.init();
  }
}

export const rootStore = new RootStore();

