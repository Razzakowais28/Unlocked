"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "pill";
}

export default function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        data-testid="theme-toggle-placeholder"
        className={cn(
          variant === "pill" ? "h-9 w-[4.5rem] rounded-full" : "h-9 w-9 rounded-xl",
          "bg-[var(--glass-bg)]",
          className
        )}
      />
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        data-testid="theme-toggle"
        className={cn(
          "flex items-center gap-1 rounded-full border border-[var(--card-border)] bg-[var(--glass-bg)] p-1 backdrop-blur-sm",
          className
        )}
      >
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all",
            theme === "light" && "bg-[var(--primary)] text-white shadow-sm"
          )}
        >
          <Sun className="h-3.5 w-3.5" />
          Light
        </span>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all",
            theme === "dark" && "bg-[var(--primary)] text-white shadow-sm"
          )}
        >
          <Moon className="h-3.5 w-3.5" />
          Dark
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      data-testid="theme-toggle"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--glass-bg)] text-[var(--foreground)] backdrop-blur-sm transition-colors hover:bg-[var(--glass-bg-hover)]",
        className
      )}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
