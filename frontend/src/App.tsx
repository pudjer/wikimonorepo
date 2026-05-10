import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import { ProfilePage } from "./pages/private/ProfilePage";
import { AppLayout } from "./components/layout/AppLayout";
import { SearchPage } from "./pages/public/SearchPage";
import { RankingPage } from "./pages/public/RankingPage";
import { AuthorPage } from "./pages/public/AuthorPage";
import { ArticlePage } from "./pages/public/ArticlePage";


export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/rank" element={<RankingPage />} />
        <Route path="/author/:id" element={<AuthorPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/" element={<Navigate to="/search" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}


