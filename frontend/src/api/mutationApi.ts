import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { API_BASE_URL } from "../config";

import type {
  ArticleResultDTO,
  CreateArticleDto,
  UpdateArticleDto,
} from "backend/src/presentation/article/common/DTO";

export type {
  ArticleResultDTO,
  CreateArticleDto,
  UpdateArticleDto,
};

import type { Success } from "backend/src/presentation/common/DTO";
export type { Success };

import type {
  InteractionResultDto,
  LikeDto,
  ViewDto,
  LearnProgressDto,
  UpdateLearnProgressDto,
} from "backend/src/presentation/interactionUserArticle/DTO";

export type {
  InteractionResultDto,
  LikeDto,
  ViewDto,
  LearnProgressDto,
  UpdateLearnProgressDto,
};

import type {
  UserOutputDtoPrivate,
  UpdateInputDtoPrivate,
} from "backend/src/presentation/user/private/DTO";

export type {
  UserOutputDtoPrivate,
  UpdateInputDtoPrivate,
};

import type {
  UserOutputDtoAdmin,
  UserUpdateInputDtoAdmin,
  UserRegisterInputDtoAdmin,
} from "backend/src/presentation/user/admin/DTO";

export type {
  UserOutputDtoAdmin,
  UserUpdateInputDtoAdmin,
  UserRegisterInputDtoAdmin,
};

import type { SessionDto, LoginDto } from "backend/src/presentation/session/DTO";
export type { SessionDto, LoginDto };

export class MutationApiClient {
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

  private = {
    articles: {
      create: (dto: CreateArticleDto): Promise<ArticleResultDTO> =>
        this.post<ArticleResultDTO>("/private/articles", dto),

      update: (id: string, dto: UpdateArticleDto): Promise<ArticleResultDTO> =>
        this.patch<ArticleResultDTO>(`/private/articles/${id}`, dto),

      delete: (id: string): Promise<Success> =>
        this.delete<Success>(`/private/articles/${id}`),
    },

    interactionUserArticle: {
      likes: {
        like: (articleId: string): Promise<Success> =>
          this.post<Success>(
            `/private/interactionUserArticle/articles/${articleId}/like`
          ),

        unlike: (articleId: string): Promise<Success> =>
          this.delete<Success>(
            `/private/interactionUserArticle/articles/${articleId}/like`
          ),
      },

      views: {
        view: (articleId: string): Promise<Success> =>
          this.post<Success>(
            `/private/interactionUserArticle/articles/${articleId}/view`
          ),

        removeView: (articleId: string): Promise<Success> =>
          this.delete<Success>(
            `/private/interactionUserArticle/articles/${articleId}/view`
          ),
      },

      learnProgress: {
        updateLearnProgress: (
          articleId: string,
          dto: UpdateLearnProgressDto
        ): Promise<Success> =>
          this.post<Success>(
            `/private/interactionUserArticle/articles/${articleId}/learnProgress`,
            dto
          ),
      },
    },

    user: {
      update: (dto: UpdateInputDtoPrivate): Promise<UserOutputDtoPrivate> =>
        this.patch<UserOutputDtoPrivate>("/private/user", dto),
    },

    admin: {
      articles: {
        update: (id: string, dto: UpdateArticleDto): Promise<ArticleResultDTO> =>
          this.patch<ArticleResultDTO>(`/admin/articles/${id}`, dto),

        delete: (id: string): Promise<Success> =>
          this.delete<Success>(`/admin/articles/${id}`),
      },

      user: {
        update: (userId: string, dto: UserUpdateInputDtoAdmin): Promise<UserOutputDtoAdmin> =>
          this.patch<UserOutputDtoAdmin>(`/admin/user/${userId}`, dto),
      },

      session: {
        logoutAll: (userId: string): Promise<Success> =>
          this.post<Success>(`/admin/session/${userId}`),
      },
    },

    session: {
      logout: (): Promise<Success> =>
        this.post<Success>("/session/logout"),

      logoutAll: (): Promise<Success> =>
        this.post<Success>("/session/logout-all"),
    },


  };
  public = {
    login: (dto: LoginDto): Promise<SessionDto> =>
      this.post<SessionDto>("/login", dto),
    user: {
      register: (dto: UserRegisterInputDtoAdmin): Promise<UserOutputDtoAdmin> =>
        this.post<UserOutputDtoAdmin>("/admin/user", dto),
    },
  }
}

export const mutationApi = new MutationApiClient(API_BASE_URL);
export default mutationApi;
