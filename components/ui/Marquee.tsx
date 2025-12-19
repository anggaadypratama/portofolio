import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
}

export const Marquee = ({ items, className }: MarqueeProps) => {
  return (
    <div
      className={cn(
        "w-full bg-black text-primary overflow-hidden py-4 border-y-2 border-black dark:border-white/20",
        className
      )}
    >
      <div className="flex whitespace-nowrap animate-marquee font-mono font-bold text-xl uppercase tracking-widest">
        {[...items, ...items, ...items].map((item, idx) => (
          <span key={idx} className="flex items-center">
            {item}
            <span className="mx-8">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};
