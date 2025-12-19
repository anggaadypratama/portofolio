import React from "react";
import { cn } from "@/lib/utils";

interface DashboardSectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export const DashboardSection = ({
  number,
  title,
  children,
  className,
  active = false,
}: DashboardSectionProps) => {
  return (
    <section className={cn("border-l-2 border-app-border pl-6 lg:pl-10 relative", className)}>
      <div 
        className={cn(
          "absolute -left-2.25 top-0 w-4 h-4 border-2 border-black transition-colors",
          active ? "bg-primary" : "bg-app-surface"
        )} 
      />
      <h2 className="font-mono text-2xl lg:text-3xl font-bold uppercase tracking-tighter mb-8 text-app-fg flex items-center gap-4">
        <span className="text-app-muted/50">{number}.</span> {title}
      </h2>
      <div className="space-y-8">
        {children}
      </div>
    </section>
  );
};
