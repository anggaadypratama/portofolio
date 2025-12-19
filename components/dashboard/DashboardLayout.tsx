"use client";

import React from "react";
import { DashboardSidebar } from "./Sidebar";
import { DashboardHeader } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: { name: string; href?: string; active?: boolean }[];
}

export const DashboardLayout = ({ children, breadcrumbs }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-app-bg text-app-fg transition-colors duration-300">
      <DashboardSidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <DashboardHeader breadcrumbs={breadcrumbs} />
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-16 bg-app-bg/50">
          {children}
        </div>
      </main>
    </div>
  );
};
