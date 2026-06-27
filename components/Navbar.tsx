"use client";

import Link from "next/link";
import { Lock, Menu, X } from "lucide-react";
import { useState } from "react";
import GlowButton from "./GlowButton";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#how-it-works", label: "Working as name" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-subtle bg-nav backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-bright)]">
            <Lock className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">unlocked</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="link-muted text-sm">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <GlowButton href="/login" variant="ghost" className="px-4 py-2">
              Log in
            </GlowButton>
            <GlowButton href="/login" className="px-4 py-2">
              Sign up
            </GlowButton>
          </div>
          <button
            className="rounded-lg p-2 text-foreground md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-subtle bg-nav backdrop-blur-xl md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col gap-2 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-muted rounded-lg px-3 py-2 text-sm hover:bg-[var(--glass-bg)]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            <GlowButton href="/login" variant="secondary" className="w-full">
              Log in
            </GlowButton>
            <GlowButton href="/login" className="w-full">
              Sign up
            </GlowButton>
          </div>
        </div>
      </div>
    </nav>
  );
}
