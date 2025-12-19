import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark" | "primary";
  withShadow?: boolean;
}

export const Card = ({
  className,
  variant = "light",
  withShadow = true,
  children,
  ...props
}: CardProps) => {
  const variants = {
    light: "bg-app-surface text-app-fg border-2 border-app-border",
    dark: "bg-app-surface text-app-fg border-2 border-app-border",
    primary: "bg-primary text-black border-2 border-black",
  };

  return (
    <div
      className={cn(
        "p-6",
        variants[variant],
        withShadow && "brutalist-shadow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
