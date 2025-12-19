import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  withBorder?: boolean;
}

export const Section = ({
  className,
  id,
  withBorder = true,
  children,
  ...props
}: SectionProps) => {
  return (
    <section
      id={id}
      className={cn(
        "py-20 px-6 md:px-20 lg:px-32 relative overflow-hidden",
        withBorder && "border-b-2 border-app-border",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};
