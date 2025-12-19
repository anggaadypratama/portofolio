"use client";

import React from "react";
import Link from "next/link";
import { cn, handleHashScroll } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, target, rel, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-mono font-bold uppercase tracking-widest transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      primary: "bg-primary text-black border-2 border-black brutalist-shadow",
      outline:
        "bg-app-surface text-app-fg border-2 border-app-border brutalist-shadow",
      ghost: "bg-transparent text-app-fg hover:bg-app-fg/5",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-lg",
    };

    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      handleHashScroll(e, href);
      if (props.onClick) {
        props.onClick(e as any);
      }
    };

    if (href) {
      // Filter out button-specific props when rendering as a Link
      const { type: _type, ...rest } = props;
      return (
        <Link
          href={href}
          className={combinedClassName}
          target={target}
          rel={rel}
          ref={ref as React.Ref<HTMLAnchorElement>}
          onClick={handleClick}
          {...(rest as any)}
        >
          {props.children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={combinedClassName}
        onClick={handleClick}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
