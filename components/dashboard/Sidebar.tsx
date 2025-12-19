"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Mail, 
  Settings, 
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Content", href: "/dashboard/content", icon: FileText },
  { name: "Media", href: "/dashboard/media", icon: ImageIcon },
  { name: "Inquiries", href: "/dashboard/inquiries", icon: Mail, badge: 3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-20 md:w-64 border-r-2 border-app-border bg-app-surface flex flex-col shrink-0 z-20 transition-all duration-300">
      <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b-2 border-app-border bg-app-surface">
        <div className="w-10 h-10 bg-primary flex items-center justify-center font-mono font-bold text-black text-xl border-2 border-black">
          C
        </div>
        <span className="hidden lg:block ml-3 font-mono font-bold text-xl tracking-tighter text-app-fg">
          CMS_V1.0
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 lg:px-6 py-3 transition-colors group border-l-4",
                isActive 
                  ? "bg-app-fg/5 text-app-fg border-primary" 
                  : "text-app-muted hover:bg-app-fg/5 hover:text-app-fg border-transparent hover:border-primary/50"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "animate-pulse")} />
              <span className="hidden lg:block ml-4 font-mono text-sm font-bold uppercase tracking-widest">
                {item.name}
              </span>
              {item.badge && (
                <span className="hidden lg:flex ml-auto w-5 h-5 bg-primary text-black text-[10px] font-bold items-center justify-center border border-black">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t-2 border-app-border bg-app-surface">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-app-muted/20 border border-app-border"></div>
          <div className="hidden lg:block">
            <p className="text-xs font-mono text-app-fg font-bold">ADMIN_USER</p>
            <p className="text-[10px] font-mono text-app-muted uppercase">Logged In</p>
          </div>
          <button 
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="ml-auto text-app-muted hover:text-red-500 hidden lg:block transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
