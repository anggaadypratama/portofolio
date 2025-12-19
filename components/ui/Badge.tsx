import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "outline" | "solid";
}

export const Badge = ({
  className,
  variant = "outline",
  ...props
}: BadgeProps) => {
  const variants = {
    outline: "border border-app-border bg-app-surface",
    solid: "bg-primary text-black border border-black",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 font-mono text-xs font-bold uppercase tracking-tight shadow-brutal-sm",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
