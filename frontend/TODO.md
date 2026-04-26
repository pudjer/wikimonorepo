# StructedWiki Frontend Implementation TODO

## Phase 1 — Setup & Tooling
- [x] Install dependencies (mobx, mobx-react-lite, react-router-dom, @mui/material, @emotion/react, @emotion/styled, axios, @mui/icons-material)
- [x] Remove legacy CSS boilerplate
- [x] Create folder structure (stores, pages, components, router, hooks, theme)

## Phase 2 — Core Infrastructure
- [x] Theme configuration (MUI theme + Roboto font)
- [x] Update main.tsx (Providers: ThemeProvider, Router, StoreProvider)
- [x] API client configuration (env-based baseURL, axios interceptors)
- [x] MobX Root Store & React Context provider
- [x] Auth Store (login/register/logout/refresh, role, isAdmin)

## Phase 3 — Domain Stores
- [x] ArticleStore (public fetch, private CRUD, admin CRUD)
- [x] SearchStore (full-text + in-articles search)
- [x] UserStore (public/private/admin user management)
- [x] InteractionStore (like/view/learnProgress)
- [x] DagStore & StatisticStore (DAG fetch, stats by ID/order)

## Phase 4 — Routing & Layout
- [x] Router definition (public, private, admin routes)
- [x] Layout with AppBar + navigation
- [x] ProtectedRoute / AdminRoute guards

## Phase 5 — Pages & Components
- [x] HomePage (trending/top articles via statistics)
- [x] ArticlePage (content, stats, DAG mini-map, interactions)
- [x] ArticleCreatePage / ArticleEditPage (forms + link manager)
- [x] SearchPage (search bar + results list)
- [x] LoginPage / RegisterPage
- [x] ProfilePage (current user info, update, logout, user articles)
- [x] AdminDashboardPage (user & article admin actions)
- [x] NotFoundPage

## Phase 6 — Polish
- [x] Global error handling / snackbar
- [x] Loading states / skeletons
- [x] Final build verification

## Phase 7 — Component Decomposition (Refactor)
- [x] Common / UI primitives: PageContainer, PageTitle, PageSpinner, EmptyState, ErrorState
- [x] Form primitives: AuthForm (shared Login/Register), ArticleForm (shared Create/Edit)
- [x] Article primitives: ReferenceListEditor, ArticleContent, ArticleStats, ArticleReferences, ArticleActions, DeleteConfirmDialog
- [x] Layout: NavButton, UserMenu
- [x] List / Search: SearchBar, SearchResultsList, ArticleList
- [x] Admin: UserManagerSection, ArticleManagerSection
- [x] Refactor all pages to use new reusable components
  - [x] LoginPage
  - [x] RegisterPage
  - [x] ArticleCreatePage
  - [x] ArticleEditPage
  - [x] ArticlePage
  - [x] SearchPage
  - [x] ProfilePage
  - [x] AdminDashboardPage
  - [x] AppBar

