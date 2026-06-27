"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
  variant?: "sidebar" | "button";
}

export default function LogoutButton({ className, variant = "button" }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-[var(--glass-bg)] hover:text-foreground disabled:opacity-50",
          className
        )}
      >
        <LogOut className="h-4 w-4" />
        {loading ? "Logging out..." : "Log out"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-[var(--glass-bg-hover)] disabled:opacity-50",
        className
      )}
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Logging out..." : "Log out"}
    </button>
  );
}
