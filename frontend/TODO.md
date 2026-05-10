# TODO (frontend)

## 0. Ввести контракт слоёв (GET/представление vs mutation)
- [ ] Зафиксировать правило: **store/stores** — только чтение/представление (GET через rule.fetch).
- [ ] Зафиксировать правило: **api.ts** используется только для **изменений** (POST/PATCH/DELETE).
- [ ] Прописать паттерн: приватный component => mutation api.ts => refresh нужных store rules.

## 1. Компоненты (новая структура каталогов)
- [ ] Создать `frontend/src/components/public/Article/`:
  - [ ] `ArticleContent.tsx` — публичный рендер контента
  - [ ] `ArticleLinks.tsx` — публичный рендер ссылок
  - [ ] `ArticleAuthorInline.tsx` — публичный author mini блок
  - [ ] `ArticleDAGPreview.tsx` — публичный DAG превью
- [ ] Создать `frontend/src/components/public/Author/`:
  - [ ] `AuthorHeader.tsx`
  - [ ] `AuthorsArticlesList.tsx`
- [ ] Создать `frontend/src/components/public/Search/`:
  - [ ] `SearchResultsList.tsx`

- [ ] Создать `frontend/src/components/private/Article/`:
  - [ ] `InteractionsPanel.tsx`
  - [ ] `LikeToggle.tsx`
  - [ ] `ViewTracker.tsx`
  - [ ] `LearningProgress.tsx`
- [ ] Создать `frontend/src/components/private/Profile/`:
  - [ ] `ProfileEditor.tsx` — форма обновления профиля (mutation)
  - [ ] `LearningHistory.tsx` — список прогресса/истории
  - [ ] `MyLearningStats.tsx` — stats DAG превью
- [ ] Создать `frontend/src/components/private/Admin/` (если появятся админ-страницы):
  - [ ] `AdminArticleEditor.tsx`
  - [ ] `AdminUserManager.tsx`

## 2. Страницы (orchestration)
- [ ] Обновить/разбить `frontend/src/pages/public/ArticlePage.tsx` на:
  - [ ] публичные блоки из `components/public/Article/*`
  - [ ] приватные блоки внутри: `components/private/Article/*`
- [ ] `frontend/src/pages/private/ProfilePage.tsx`:
  - [ ] публичные/приватные подблоки вынести в `components/private/Profile/*`
- [ ] (опционально) `frontend/src/pages/public/AuthorPage.tsx`:
  - [ ] вынести витрину статей в `components/public/Author/*`
- [ ] (опционально) `frontend/src/pages/public/SearchPage.tsx`:
  - [ ] вынести список результатов в `components/public/Search/*`

## 3. Store правила (будущие файлы)
- [ ] Публичная статья:
  - [ ] расширить `frontend/src/store/stores/public/ArticleFull.ts` (если нужно) под контент/links/authorDAG-секции
  - [ ] оставить `frontend/src/store/stores/public/ArticleBase.ts` как базовые методы (getAuthor, getInteractions может оставаться только как приватный-агрегат с null)
- [ ] Приватные срезы:
  - [ ] `frontend/src/store/stores/private/LearningProgressState.ts` (если текущая логика не покрывает блок)
  - [ ] (опционально) `frontend/src/store/stores/private/InteractionLikeState.ts`
  - [ ] (опционально) `frontend/src/store/stores/private/InteractionViewState.ts`
  - [ ] Проверить `frontend/src/store/stores/private/MeBuild/MyLearningHystory.ts` — достаточно ли для блока LearningHistory

## 4. Mutation-триггеры и refresh (обвязка)
- [ ] Добавить helper (при необходимости): `frontend/src/lib/store/mutations/`
  - [ ] `withMutationState.ts` — единый loading/error
  - [ ] `refreshStrategy.ts` — определить какие правила перезагружать после mutation
- [ ] В `components/private/Article/LikeToggle.tsx`:
  - [ ] mutation: `api.private.interactionUserArticle.likes.like/unlike`
  - [ ] refresh: обновить тотал interactions (и/или соответствующие private store)
- [ ] В `components/private/Article/ViewTracker.tsx`:
  - [ ] mutation: `api.private.interactionUserArticle.views.view/removeView`
  - [ ] refresh: обновить тотал views
- [ ] В `components/private/Article/LearningProgress.tsx`:
  - [ ] mutation: `api.private.interactionUserArticle.learnProgress.updateLearnProgress`
  - [ ] refresh: обновить прогресс/историю
- [ ] В `components/private/Profile/ProfileEditor.tsx`:
  - [ ] mutation: `api.private.user.update`
  - [ ] refresh: обновить `MeRule` и/или `MyProfileRule`

## 5. Проверка “публичная страница + приватный внутренний компонент”
- [ ] Убедиться, что приватные компоненты безопасно работают при отсутствии авторизации:
  - [ ] использовать логику уровня store (например `NullIfUnauthorized(...)`)
  - [ ] приватный компонент не падает при null/unauth

## 6. Тестирование
- [ ] Прогнать сборку/линт: `pnpm -C frontend lint` (если есть)
- [ ] Запустить dev сервер: `pnpm -C frontend dev`
- [ ] Пройти сценарии:
  - [ ] Public article page без логина (приватные блоки отображают null-state)
  - [ ] Public article page с логином (лайк/вью/прогресс работает)
  - [ ] Private profile page (редактор профиля изменяет данные)

