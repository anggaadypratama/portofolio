import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import QueryProvider from "@/components/providers/QueryProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = [
    { name: "DASHBOARD", href: "/dashboard" },
    { name: "EDIT_PORTFOLIO", active: true },
  ];

  return (
    <QueryProvider>
      <DashboardLayout breadcrumbs={breadcrumbs}>
        {children}
      </DashboardLayout>
    </QueryProvider>
  );
}
