"use client";

import React from "react";
import { Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  breadcrumbs?: { name: string; href?: string; active?: boolean }[];
}

export const DashboardHeader = ({ breadcrumbs = [] }: HeaderProps) => {
  return (
    <header className="h-20 border-b-2 border-app-border flex items-center justify-between px-6 lg:px-10 bg-app-surface z-10">
      <div className="flex items-center gap-2 text-sm font-mono text-app-muted uppercase">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.name}>
            {index > 0 && <span>/</span>}
            <span className={crumb.active ? "text-primary font-bold bg-primary/10 px-1" : "text-app-fg"}>
              {crumb.name}
            </span>
          </React.Fragment>
        ))}
      </div>
      
      {/* <div className="flex gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden sm:flex items-center gap-2"
        >
          <Eye size={16} />
          <span>Preview</span>
        </Button>
        <Button 
          variant="primary" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <Save size={16} />
          <span>Save Changes</span>
        </Button>
      </div> */}
    </header>
  );
};
