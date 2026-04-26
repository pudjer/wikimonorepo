# TODO: Add imports to frontend/src/api.ts from backend/src/presentation

## Plan
- [x] Add import statements for all DTO types used in `frontend/src/api.ts` from `backend/src/presentation/*`

## Types imported
1. From `backend/src/presentation/article/common/DTO.ts`:
   - `ArticleResultDTO`, `ArticleIdCollectionResultDTO`, `CreateArticleDto`, `UpdateArticleDto`
2. From `backend/src/presentation/common/DTO.ts`:
   - `Success`
3. From `backend/src/presentation/articleDAG/DTO.ts`:
   - `ArticleDAGResultDTO`
4. From `backend/src/presentation/articleStatistic/DTO.ts`:
   - `ArticleStatisticResultDTO`, `GetByIdsDto`, `ArticleStatisticCollectionResultDTO`, `OrderDto`
5. From `backend/src/presentation/search/DTO.ts`:
   - `SearchArticlesQueryDto`, `SearchInArticlesQueryDto`, `SearchArticlesResultDto`
6. From `backend/src/presentation/interactionUserArticle/DTO.ts`:
   - `UpdateLearnProgressDto`, `InteractionResultDto`
7. From `backend/src/presentation/user/public/DTO.ts`:
   - `UserOutputDtoPublic`, `UserRegisterInputDtoPublic`
8. From `backend/src/presentation/user/DTO.ts`:
   - `RegisterOutputDto`
9. From `backend/src/presentation/user/private/DTO.ts`:
   - `UserOutputDtoPrivate`, `UpdateInputDtoPrivate`
10. From `backend/src/presentation/user/admin/DTO.ts`:
    - `UserOutputDtoAdmin`, `UserUpdateInputDtoAdmin`, `UserRegisterInputDtoAdmin`
11. From `backend/src/presentation/session/DTO.ts`:
    - `SessionDto`, `LoginDto`

