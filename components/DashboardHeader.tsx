"use client";

import GlowButton from "./GlowButton";
import LogoutButton from "./LogoutButton";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  greeting: string;
}

export default function DashboardHeader({ greeting }: DashboardHeaderProps) {
  return (
    <header className="header-bar px-4 py-4 md:px-8 md:py-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{greeting}</h1>
          <p className="mt-1 text-sm text-muted">
            Lock away your memories until the moment that matters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LogoutButton className="md:hidden" />
          <GlowButton href="/capsules/new" className="hidden md:inline-flex">
            <Plus className="h-4 w-4" />
            New Capsule
          </GlowButton>
        </div>
      </div>
    </header>
  );
}
