import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = [
    { name: "DASHBOARD", href: "/dashboard" },
    { name: "EDIT_PORTFOLIO", active: true },
  ];

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      {children}
    </DashboardLayout>
  );
}
