import { makeAutoObservable, runInAction } from "mobx";
import type { ArticleResultDTO, CreateArticleDto, UpdateArticleDto } from "../api";
import { api } from "../api";
import type { UiStore } from "./uiStore";

export class ArticleStore {
  articles = new Map<string, ArticleResultDTO>();
  currentArticle: ArticleResultDTO | null = null;
  authorArticleIds: string[] = [];
  isLoading = false;
  ui: UiStore;

  constructor(ui: UiStore) {
    this.ui = ui;
    makeAutoObservable(this, { ui: false }, { autoBind: true });
  }

  async fetchById(id: string, setCurrent = true) {
    this.isLoading = true;
    try {
      const article = await api.publicArticles.getById(id);
      runInAction(() => {
        this.articles.set(id, article);
        if (setCurrent) {
          this.currentArticle = article;
        }
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load article";
      this.ui.showError(msg);
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchManyByIds(ids: string[]) {
    this.isLoading = true;
    try {
      await Promise.all(ids.map((id) => api.publicArticles.getById(id).then((article) => {
        runInAction(() => {
          this.articles.set(id, article);
        });
      })));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load articles";
      this.ui.showError(msg);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async fetchByAuthorId(authorId: string) {
    this.isLoading = true;
    try {
      const data = await api.publicArticles.getByAuthorId(authorId);
      runInAction(() => {
        this.authorArticleIds = data.ids;
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load author's articles";
      this.ui.showError(msg);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async create(dto: CreateArticleDto) {
    this.isLoading = true;
    try {
      const article = await api.privateArticles.create(dto);
      runInAction(() => {
        this.articles.set(article.id, article);
        this.currentArticle = article;
      });
      this.ui.showSuccess("Article created");
      return article;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to create article";
      this.ui.showError(msg);
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async update(id: string, dto: UpdateArticleDto) {
    this.isLoading = true;
    try {
      const article = await api.privateArticles.update(id, dto);
      runInAction(() => {
        this.articles.set(id, article);
        if (this.currentArticle?.id === id) {
          this.currentArticle = article;
        }
      });
      this.ui.showSuccess("Article updated");
      return article;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update article";
      this.ui.showError(msg);
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async delete(id: string) {
    this.isLoading = true;
    try {
      await api.privateArticles.delete(id);
      runInAction(() => {
        this.articles.delete(id);
        if (this.currentArticle?.id === id) {
          this.currentArticle = null;
        }
      });
      this.ui.showSuccess("Article deleted");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to delete article";
      this.ui.showError(msg);
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async adminUpdate(id: string, dto: UpdateArticleDto) {
    this.isLoading = true;
    try {
      const article = await api.adminArticles.update(id, dto);
      runInAction(() => {
        this.articles.set(id, article);
        if (this.currentArticle?.id === id) {
          this.currentArticle = article;
        }
      });
      this.ui.showSuccess("Article updated (admin)");
      return article;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update article";
      this.ui.showError(msg);
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async adminDelete(id: string) {
    this.isLoading = true;
    try {
      await api.adminArticles.delete(id);
      runInAction(() => {
        this.articles.delete(id);
        if (this.currentArticle?.id === id) {
          this.currentArticle = null;
        }
      });
      this.ui.showSuccess("Article deleted (admin)");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to delete article";
      this.ui.showError(msg);
      throw e;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

