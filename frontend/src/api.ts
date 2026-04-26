import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { API_BASE_URL } from "./config";

// ===================== Enums =====================

export enum RoleName {
  Base = "base",
  Admin = "admin",
}

export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}

export enum OrderingProp {
  views = "views",
  likes = "likes",
  learners = "learners",
  masters = "masters",
  dagPoints = "dagPoints",
}

export enum LearnProgressStage {
  Learning = "learning",
  Mastered = "mastered",
  Unknown = "unknown",
}

// ===================== Common DTOs =====================

export interface Success {
  success: boolean;
}

// ===================== Article DTOs =====================

export interface ArticleReferenceDto {
  name: string;
  parent: string;
}

export interface CreateArticleDto {
  title: string;
  content: string;
  links: ArticleReferenceDto[];
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  links?: ArticleReferenceDto[];
}

export interface ArticleResultDTO {
  id: string;
  authorId: string;
  title: string;
  content: string;
  links: ArticleReferenceDto[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticleIdCollectionResultDTO {
  ids: string[];
}

// ===================== ArticleDAG DTOs =====================

export interface ArticleLinkDTO {
  child: string;
  parent: string;
  name: string;
}

export interface ArticleDAGResultDTO {
  nodes: string[];
  links: ReadonlyArray<ArticleLinkDTO>;
}

// ===================== ArticleStatistic DTOs =====================

export interface GetByIdsDto {
  ids: string[];
}

export interface OrderDto {
  order: Order;
  orderingProp: OrderingProp;
}

export interface ArticleStatisticResultDTO {
  articleId: string;
  views: number;
  likes: number;
  learners: number;
  masters: number;
  dagPoints: number;
}

export interface ArticleStatisticCollectionResultDTO {
  statistics: ArticleStatisticResultDTO[];
}

// ===================== Search DTOs =====================

export interface SearchArticlesQueryDto {
  query: string;
  page?: number;
  size?: number;
}

export interface SearchInArticlesQueryDto extends SearchArticlesQueryDto {
  articleIds: string[];
}

export interface ArticleSearchResultDto {
  id: string;
  title: string;
  contentSnippet: string;
  authorId: string;
  relevanceScore: number;
}

export interface SearchArticlesResultDto {
  results: ArticleSearchResultDto[];
}

// ===================== InteractionUserArticle DTOs =====================

export interface UpdateLearnProgressDto {
  stage: LearnProgressStage;
}

export interface InteractionResultDto {
  isViewed: boolean;
  isLiked: boolean;
  learnProgressStage: LearnProgressStage;
  lastInteraction: string | null;
}

// ===================== User DTOs =====================

export interface UserOutputDtoPublic {
  id: string;
  username: string;
}

export interface UserRegisterInputDtoPublic {
  username: string;
  password: string;
}

export interface UpdateInputDtoPrivate {
  username?: string;
  password?: string;
}

export interface UserOutputDtoPrivate {
  id: string;
  username: string;
}

export interface UserUpdateInputDtoAdmin {
  username?: string;
  password?: string;
  role?: RoleName;
}

export interface UserRegisterInputDtoAdmin {
  username: string;
  password: string;
  role: RoleName;
}

export interface UserOutputDtoAdmin {
  id: string;
  username: string;
  role: RoleName;
}

export interface RegisterOutputDto {
  id: string;
  username: string;
}

// ===================== Session DTOs =====================

export interface LoginDto {
  username: string;
  password: string;
}

export interface SessionDto {
  sessionId: string;
}

// ===================== API Client =====================

export class ApiClient {
  private readonly client: AxiosInstance;
  private refreshIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }


  private async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const res: AxiosResponse<T> = await this.client.get(url, { params });
    return res.data;
  }

  private async post<T>(url: string, data?: unknown): Promise<T> {
    const res: AxiosResponse<T> = await this.client.post(url, data);
    return res.data;
  }

  private async patch<T>(url: string, data?: unknown): Promise<T> {
    const res: AxiosResponse<T> = await this.client.patch(url, data);
    return res.data;
  }

  private async delete<T>(url: string): Promise<T> {
    const res: AxiosResponse<T> = await this.client.delete(url);
    return res.data;
  }

  // -------- Public Articles --------

  publicArticles = {
    getById: (id: string): Promise<ArticleResultDTO> =>
      this.get<ArticleResultDTO>(`/public/articles/article/${id}`),

    getByAuthorId: (id: string): Promise<ArticleIdCollectionResultDTO> =>
      this.get<ArticleIdCollectionResultDTO>(`/public/articles/author/${id}`),
  };

  // -------- Private Articles --------

  privateArticles = {
    create: (dto: CreateArticleDto): Promise<ArticleResultDTO> =>
      this.post<ArticleResultDTO>("/private/articles", dto),

    update: (id: string, dto: UpdateArticleDto): Promise<ArticleResultDTO> =>
      this.patch<ArticleResultDTO>(`/private/articles/${id}`, dto),

    delete: (id: string): Promise<Success> =>
      this.delete<Success>(`/private/articles/${id}`),
  };

  // -------- Admin Articles --------

  adminArticles = {
    update: (id: string, dto: UpdateArticleDto): Promise<ArticleResultDTO> =>
      this.patch<ArticleResultDTO>(`/admin/articles/${id}`, dto),

    delete: (id: string): Promise<Success> =>
      this.delete<Success>(`/admin/articles/${id}`),
  };

  // -------- Public ArticleDAG --------

  publicArticleDAG = {
    getDAG: (ids: string[]): Promise<ArticleDAGResultDTO> =>
      this.get<ArticleDAGResultDTO>("/public/articleDAG", { ids }),
  };

  // -------- Public ArticleStatistic --------

  publicArticleStatistic = {
    getById: (id: string): Promise<ArticleStatisticResultDTO> =>
      this.get<ArticleStatisticResultDTO>(`/public/articleStatistic/stats/${id}`),

    getByIds: (dto: GetByIdsDto): Promise<ArticleStatisticCollectionResultDTO> =>
      this.post<ArticleStatisticCollectionResultDTO>("/public/articleStatistic/by-ids", dto),

    getInOrder: (dto: OrderDto): Promise<ArticleStatisticCollectionResultDTO> =>
      this.get<ArticleStatisticCollectionResultDTO>("/public/articleStatistic/order", {
        order: dto.order,
        orderingProp: dto.orderingProp,
      }),
  };

  // -------- Public Search --------

  publicSearch = {
    searchArticles: (dto: SearchArticlesQueryDto): Promise<SearchArticlesResultDto> =>
      this.get<SearchArticlesResultDto>("/public/search/articles", {
        query: dto.query,
        page: dto.page,
        size: dto.size,
      }),

    searchInArticles: (dto: SearchInArticlesQueryDto): Promise<SearchArticlesResultDto> =>
      this.get<SearchArticlesResultDto>("/public/search/in-articles", {
        query: dto.query,
        articleIds: dto.articleIds,
        page: dto.page,
        size: dto.size,
      }),
  };

  // -------- Private InteractionUserArticle --------

  privateInteractionUserArticle = {
    updateLearnProgress: (articleId: string, dto: UpdateLearnProgressDto): Promise<Success> =>
      this.post<Success>(`/private/interactionUserArticle/articles/${articleId}/learnProgress`, dto),

    like: (articleId: string): Promise<Success> =>
      this.post<Success>(`/private/interactionUserArticle/articles/${articleId}/like`),

    unlike: (articleId: string): Promise<Success> =>
      this.delete<Success>(`/private/interactionUserArticle/articles/${articleId}/like`),

    view: (articleId: string): Promise<Success> =>
      this.post<Success>(`/private/interactionUserArticle/articles/${articleId}/view`),

    removeView: (articleId: string): Promise<Success> =>
      this.delete<Success>(`/private/interactionUserArticle/articles/${articleId}/view`),

    getTotal: (articleId: string): Promise<InteractionResultDto> =>
      this.get<InteractionResultDto>(`/private/interactionUserArticle/articles/${articleId}/total`),
  };

  // -------- Public User --------

  publicUser = {
    get: (userId: string): Promise<UserOutputDtoPublic> =>
      this.get<UserOutputDtoPublic>(`/public/user/${userId}`),

    register: (dto: UserRegisterInputDtoPublic): Promise<RegisterOutputDto> =>
      this.post<RegisterOutputDto>("/public/user", dto),
  };

  // -------- Private User --------

  privateUser = {
    get: (): Promise<UserOutputDtoPrivate> =>
      this.get<UserOutputDtoPrivate>("/private/user"),

    update: (dto: UpdateInputDtoPrivate): Promise<UserOutputDtoPrivate> =>
      this.patch<UserOutputDtoPrivate>("/private/user", dto),
  };

  // -------- Admin User --------

  adminUser = {
    get: (userId: string): Promise<UserOutputDtoAdmin> =>
      this.get<UserOutputDtoAdmin>(`/admin/user/${userId}`),

    update: (userId: string, dto: UserUpdateInputDtoAdmin): Promise<UserOutputDtoAdmin> =>
      this.patch<UserOutputDtoAdmin>(`/admin/user/${userId}`, dto),

    register: (dto: UserRegisterInputDtoAdmin): Promise<UserOutputDtoAdmin> =>
      this.post<UserOutputDtoAdmin>("/admin/user", dto),
  };

  // -------- Session --------

  session = {
    refresh: (): Promise<SessionDto> =>
      this.post<SessionDto>("/session/refresh"),

    logout: (): Promise<Success> =>
      this.post<Success>("/session/logout"),

    logoutAll: (): Promise<Success> =>
      this.post<Success>("/session/logout-all"),
  };

  // -------- Login --------

  login = {
    login: (dto: LoginDto): Promise<SessionDto> =>
      this.post<SessionDto>("/login", dto),
  };

  // -------- Admin Session --------

  adminSession = {
    logoutAll: (userId: string): Promise<Success> =>
      this.post<Success>(`/admin/session/${userId}`),
  };
}

// ===================== Default Singleton =====================

export const api = new ApiClient(API_BASE_URL);
export default api;

