

import { Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { f } from "./lib";
import { RootRule, MeRule } from "./store";
import { HeaderComponent } from "./components";
import { TrendingPage, ArticlePage, AuthorPage, CreateArticlePage } from "./pages";

const ProtectedRoute = f.observer(({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const { data: root, isPending } = RootRule.useResolve(true);
  if (isPending) {
    return <Box>{t('app.loading')}</Box>;
  }
  if (!root?.myId) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
});

export const App = f.observer(() => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "background.default", color: "text.primary" }}>
      <HeaderComponent />
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/author/:id" element={<AuthorPage />} />

          {/* Protected Routes */}
          <Route
            path="/create-article"
            element={
              <ProtectedRoute>
                <CreateArticlePage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/trending" replace />} />
        </Routes>
      </Box>
    </Box>
  );
});


