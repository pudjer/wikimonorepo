import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { API_BASE_URL } from "./config";

import type {
  ArticleResultDTO,
  ArticleIdCollectionResultDTO,
  CreateArticleDto,
  UpdateArticleDto,
  MinifiedArticleResultDTO,
} from "backend/src/presentation/article/common/DTO";

export type {
  ArticleResultDTO,
  ArticleIdCollectionResultDTO,
  CreateArticleDto,
  UpdateArticleDto,
  MinifiedArticleResultDTO,
}



import type { Success } from "backend/src/presentation/common/DTO";

export type { Success }

import type { ArticleDAGResultDTO } from "backend/src/presentation/articleDAG/DTO";

export type { ArticleDAGResultDTO }

import type {
  ArticlePreviewResultDTO,
  GetByIdsDto,
  ArticlePreviewCollectionResultDTO,
  OrderDto,
} from "backend/src/presentation/articlePreview/DTO";

export type {
  ArticlePreviewResultDTO,
  GetByIdsDto,
  ArticlePreviewCollectionResultDTO,
  OrderDto,
}

import type {
  SearchArticlesQueryDto,
  SearchInArticlesQueryDto,
  SearchArticlesResultDto,
} from "backend/src/presentation/search/DTO";

export type {
  SearchArticlesQueryDto,
  SearchInArticlesQueryDto,
  SearchArticlesResultDto,
}

import type {
  UpdateLearnProgressDto,
  InteractionResultDto,
  LikeDto,
  ViewDto,
  LearnProgressDto,
} from "backend/src/presentation/interactionUserArticle/DTO";

export type {
  UpdateLearnProgressDto,
  InteractionResultDto,
  LikeDto,
  ViewDto,
  LearnProgressDto,
}

import type {
  UserOutputDtoPublic,
  UserRegisterInputDtoPublic,
} from "backend/src/presentation/user/public/DTO";

export type {
  UserOutputDtoPublic,
  UserRegisterInputDtoPublic,
}

import type { RegisterOutputDto } from "backend/src/presentation/user/DTO";

export type { RegisterOutputDto }

import type {
  UserOutputDtoPrivate,
  UpdateInputDtoPrivate,
} from "backend/src/presentation/user/private/DTO";

export type {
  UserOutputDtoPrivate,
  UpdateInputDtoPrivate,
}

import type {
  UserOutputDtoAdmin,
  UserUpdateInputDtoAdmin,
  UserRegisterInputDtoAdmin,
} from "backend/src/presentation/user/admin/DTO";

export type {
  UserOutputDtoAdmin,
  UserUpdateInputDtoAdmin,
  UserRegisterInputDtoAdmin,
}

import type { ArticleReferenceDto } from "backend/src/presentation/article/common/DTO";
export type { ArticleReferenceDto }

import type { ArticleSearchResultDto } from "backend/src/presentation/search/DTO";
export type { ArticleSearchResultDto }

import type { SessionDto, LoginDto } from "backend/src/presentation/session/DTO";

export type { SessionDto, LoginDto }

import { PreviewOrder as Order, PreviewOrderingProp as OrderingProp } from "backend/src/domain/articlePreview/entity";
export { Order, OrderingProp }
import { LearnProgressStage } from "backend/src/domain/interactionUserArticle/learnProgress/entity";
export { LearnProgressStage }
import { RoleName } from "backend/src/domain/user/roles";
export { RoleName }

// ===================== API Client =====================

export class ApiClient {
  private readonly client: AxiosInstance;

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

    getMinifiedById: (id: string): Promise<MinifiedArticleResultDTO> =>
      this.get<MinifiedArticleResultDTO>(`/public/articles/minified/${id}`),
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

  // -------- Public ArticlePreview --------

  publicArticlePreview = {
    getById: (id: string): Promise<ArticlePreviewResultDTO> =>
      this.get<ArticlePreviewResultDTO>(`/public/articlePreview/${id}`),

    getByIds: (dto: GetByIdsDto): Promise<ArticlePreviewCollectionResultDTO> =>
      this.post<ArticlePreviewCollectionResultDTO>("/public/articlePreview/by-ids", dto),

    getInOrder: (dto: OrderDto): Promise<ArticlePreviewCollectionResultDTO> =>
      this.get<ArticlePreviewCollectionResultDTO>("/public/articlePreview/order", {
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

    getLikes: (): Promise<LikeDto[]> =>
      this.get<LikeDto[]>("/private/interactionUserArticle/likes"),

    getViews: (): Promise<ViewDto[]> =>
      this.get<ViewDto[]>("/private/interactionUserArticle/views"),

    getLearnProgress: (): Promise<LearnProgressDto[]> =>
      this.get<LearnProgressDto[]>("/private/interactionUserArticle/learnProgress"),
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

