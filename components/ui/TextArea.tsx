import React from "react";
import { cn } from "@/lib/utils";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block font-mono font-bold text-app-fg text-xs uppercase tracking-widest">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "min-h-30 w-full bg-app-surface border-2 border-app-border p-4 font-mono text-sm text-app-fg transition-all resize-y",
            "focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]",
            "placeholder:text-app-muted/50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
