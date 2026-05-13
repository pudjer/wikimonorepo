import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { API_BASE_URL } from "../config";

import type {
  ArticleResultDTO,
  ArticleIdCollectionResultDTO,
  CreateArticleDto,
  UpdateArticleDto,
  ArticleReferenceDto,
} from "backend/src/presentation/article/common/DTO";

export type {
  ArticleResultDTO,
  ArticleIdCollectionResultDTO,
  CreateArticleDto,
  UpdateArticleDto,
  ArticleReferenceDto,
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
  ArticleQueryDto,
  SearchArticlesResultDto,
  ArticleSearchResultDto,
} from "backend/src/presentation/search/DTO";

export type {
  ArticleQueryDto,
  SearchArticlesResultDto,
  ArticleSearchResultDto,
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
} from "backend/src/presentation/user/public/DTO";

export type {
  UserOutputDtoPublic,
}

import type { RegisterOutputDto } from "backend/src/presentation/user/DTO";

export type { RegisterOutputDto }

import type {
  UserOutputDtoPrivate,
} from "backend/src/presentation/user/private/DTO";

export type {
  UserOutputDtoPrivate,
}

import type {
  UserOutputDtoAdmin,
} from "backend/src/presentation/user/admin/DTO";

export type {
  UserOutputDtoAdmin,
}

import type { SessionDto } from "backend/src/presentation/session/DTO";

export type { SessionDto }

import { PreviewOrder as Order, PreviewOrderingProp as OrderingProp } from "backend/src/domain/articlePreview/entity";
export { Order, OrderingProp }

// ===================== API Client =====================

export class QueryApiClient {
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

  // ===================== Only Queries (read) =====================

  public = {
    articles: {
      getById: (id: string): Promise<ArticleResultDTO> =>
        this.get<ArticleResultDTO>(`/public/articles/article/${id}`),

      getByAuthorId: (id: string): Promise<ArticleIdCollectionResultDTO> =>
        this.get<ArticleIdCollectionResultDTO>(`/public/articles/author/${id}`),
    },

    articleDAG: {
      getDAG: (ids: string[]): Promise<ArticleDAGResultDTO> =>
        this.post<ArticleDAGResultDTO>("/public/articleDAG", { ids }),
    },

    articlePreview: {
      getById: (id: string): Promise<ArticlePreviewResultDTO> =>
        this.get<ArticlePreviewResultDTO>(`/public/articlePreview/stat/${id}`),

      getByIds: (dto: GetByIdsDto): Promise<ArticlePreviewCollectionResultDTO> =>
        this.post<ArticlePreviewCollectionResultDTO>("/public/articlePreview/by-ids", dto),

      getInOrder: (dto: OrderDto): Promise<ArticlePreviewCollectionResultDTO> =>
        this.get<ArticlePreviewCollectionResultDTO>("/public/articlePreview/order", {
          order: dto.order,
          orderingProp: dto.orderingProp,
        }),
    },

    searchArticle: (dto: ArticleQueryDto): Promise<SearchArticlesResultDto> =>
      this.post<SearchArticlesResultDto>("/public/search/articles", dto),

    user: {
      getById: (userId: string): Promise<UserOutputDtoPublic> =>
        this.get<UserOutputDtoPublic>(`/public/user/id/${userId}`),
      getByUsername: (userName: string): Promise<UserOutputDtoPublic> =>
        this.get<UserOutputDtoPublic>(`/public/user/username/${userName}`),

    },
  };

  private = {
    interactionUserArticle: {
      likes: {
        getLikes: (): Promise<LikeDto[]> =>
          this.get<LikeDto[]>("/private/interactionUserArticle/likes"),
      },

      views: {
        getViews: (): Promise<ViewDto[]> =>
          this.get<ViewDto[]>("/private/interactionUserArticle/views"),
      },

      learnProgress: {
        getLearnProgress: (): Promise<LearnProgressDto[]> =>
          this.get<LearnProgressDto[]>("/private/interactionUserArticle/learnProgress"),
      },

      total: {
        getTotal: (articleId: string): Promise<InteractionResultDto> =>
          this.get<InteractionResultDto>(`/private/interactionUserArticle/articles/${articleId}/total`),

        getTotalAll: (): Promise<InteractionResultDto[]> =>
          this.get<InteractionResultDto[]>(`/private/interactionUserArticle/total`),

        getTotalByIds: (ids: string[]): Promise<InteractionResultDto[]> =>
          this.post<InteractionResultDto[]>("/private/interactionUserArticle/total/by-ids", { ids }),
      },
    },

    user: {
      get: (): Promise<UserOutputDtoPrivate> =>
        this.get<UserOutputDtoPrivate>("/private/user"),
    },
  };

  admin = {
    user: {
      get: (userId: string): Promise<UserOutputDtoAdmin> =>
        this.get<UserOutputDtoAdmin>(`/admin/user/${userId}`),
    },
  };

  session = {
    refresh: (): Promise<SessionDto> =>
      this.post<SessionDto>("/session/refresh"),
  };
}

// ===================== Default Singleton =====================

export const queryApi = new QueryApiClient(API_BASE_URL);
export default queryApi;

