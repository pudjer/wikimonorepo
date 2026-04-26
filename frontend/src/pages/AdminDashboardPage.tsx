import { observer } from "mobx-react-lite";
import { PageTitle } from "../components/common/PageTitle";
import { UserManagerSection } from "../components/admin/UserManagerSection";
import { ArticleManagerSection } from "../components/admin/ArticleManagerSection";

export const AdminDashboardPage = observer(function AdminDashboardPage() {
  return (
    <>
      <PageTitle>Admin Dashboard</PageTitle>
      <UserManagerSection />
      <ArticleManagerSection />
    </>
  );
});

