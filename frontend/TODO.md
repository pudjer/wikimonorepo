# Frontend TODO

- [ ] Создать `AppLayout` (layout + Outlet) на MUI
- [ ] Создать `AppHeader` (Login/Register/Profile/Logout по `root.me`)
- [ ] Создать страницы: `LoginPage`, `RegisterPage`, `ProfilePage`
- [ ] Подключить роутинг в `frontend/src/App.tsx`
- [ ] В login/register/logout после мутации делать `RootRule.refresh(undefined)`
- [ ] В роут-компонентах и компонентах, читающих store, оборачивать через `f.observer` (как в mobx)
- [ ] Проверить `pnpm -s lint` и `pnpm -s build`
- [ ] UI: добавить `ArticlePreviewMini`, `AuthorMini`
- [ ] UI: страницы `/search`, `/rank` (ранжирование через `InOrderRule`), `/author/:id`, `/article/:id`
- [ ] UI: обновить `AppHeader` только навигацией в поиск/ранжирование


