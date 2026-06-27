"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function GlowButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
  disabled = false,
}: GlowButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300",
    variant === "primary" &&
      "bg-gradient-to-r from-[var(--primary)] to-[var(--primary-bright)] text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:brightness-110",
    variant === "secondary" &&
      "border border-[var(--card-border)] bg-[var(--glass-bg)] text-foreground hover:bg-[var(--glass-bg-hover)]",
    variant === "ghost" && "text-muted hover:text-foreground hover:bg-[var(--glass-bg)]",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link href={href} className={baseClasses}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </motion.button>
  );
}
