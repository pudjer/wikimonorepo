import { Routes, Route, Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "../hooks/useStores";
import { Layout } from "../components/Layout/Layout";
import { HomePage } from "../pages/HomePage";
import { ArticlePage } from "../pages/ArticlePage";
import { ArticleCreatePage } from "../pages/ArticleCreatePage";
import { ArticleEditPage } from "../pages/ArticleEditPage";
import { SearchPage } from "../pages/SearchPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProfilePage } from "../pages/ProfilePage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ArticleAdminEditPage } from "../pages/ArticleAdminEditPage";
import type { ReactNode } from "react";

const ProtectedRoute = observer(({ children }: { children: ReactNode }) => {
  const { authStore } = useStores();
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
});

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user/:userId" element={<ProfilePage />} />
        <Route
          path="/article/create"
          element={
            <ProtectedRoute>
              <ArticleCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article/:id/edit"
          element={
            <ProtectedRoute>
              <ArticleEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/article/:id/editAdmin"
          element={
            <ProtectedRoute>
              <ArticleAdminEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

