import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function handleHashScroll(e: React.MouseEvent<HTMLElement>, href?: string) {
  if (href?.startsWith("#")) {
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", href);
    }
  }
}
