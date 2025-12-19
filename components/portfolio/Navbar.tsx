"use client";

import React, { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { handleHashScroll } from "@/lib/utils";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initNavbar = () => {
      setMounted(true);
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }
    };

    const handle = requestAnimationFrame(initNavbar);
    return () => cancelAnimationFrame(handle);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  // Prevent hydration mismatch by rendering a skeleton or stable state until mounted
  const currentLogo = !mounted || theme === "light" ? "/logo.svg" : "/logo-white.svg";
  const ThemeIcon = !mounted || theme === "light" ? Moon : Sun;

  return (
    <header className="fixed top-0 w-full z-50 bg-app-bg/95 backdrop-blur-md border-b-2 border-app-border py-4 px-4 md:px-10 flex justify-between items-center transition-colors">
      <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
        <div className="w-10 h-10 sm:w-12 sm:h-12  rounded-full flex items-center justify-center transform transition-transform group-hover:rotate-12">
          <Image src={currentLogo} alt="Logo" width={50} height={50} priority />
        </div>
        <h1 className="font-mono font-bold text-base sm:text-xl uppercase tracking-tighter text-app-fg">
          Angga Ady Pratama
        </h1>
      </div>

      <nav className="hidden md:flex gap-8 font-mono text-xs font-bold uppercase tracking-widest text-app-fg">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => handleHashScroll(e, link.href)}
            className="hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            {link.name}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="p-2 brutalist-shadow"
        >
          <ThemeIcon size={18} />
        </Button>

        <button
          className="md:hidden text-app-fg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-app-bg border-b-2 border-app-border p-6 md:hidden flex flex-col gap-6 font-mono text-sm font-bold uppercase text-app-fg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                handleHashScroll(e, link.href);
                setIsMenuOpen(false);
              }}
              className="hover:text-primary"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
