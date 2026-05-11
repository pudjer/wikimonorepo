

import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { f } from "./lib";
import { RootRule, MeRule } from "./store";
import { HeaderComponent } from "./components";
import { TrendingPage, ArticlePage, AuthorPage, CreateArticlePage, LearningDagPage, LoginPage } from "./pages";

const ProtectedRoute = f.observer(({ children }: { children: React.ReactNode }) => {
  const {data: root, isPending} = RootRule.useResolve(true);
  if (isPending) {
    return <Box>Loading...</Box>;
  }
  if (!root?.myId) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
});

export const App = f.observer(() => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <HeaderComponent />
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/author/:id" element={<AuthorPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/create-article"
            element={
              <ProtectedRoute>
                <CreateArticlePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning-dag"
            element={
              <ProtectedRoute>
                <LearningDagPage />
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


