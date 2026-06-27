"use client";

import { LayoutDashboard, Box, Share2, LayoutTemplate, Brain, User, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/capsules", label: "My Capsules", icon: Box },
  { href: "/dashboard/shared", label: "Shared with me", icon: Share2 },
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/memories", label: "Memories", icon: Brain },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function isItemActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-subtle bg-sidebar p-4 md:flex md:flex-col">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                isItemActive(pathname, item.href, item.exact)
                  ? "nav-active"
                  : "link-muted hover:bg-[var(--glass-bg)] hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-subtle pt-4">
          <LogoutButton variant="sidebar" />
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-subtle bg-bottom-nav backdrop-blur-xl md:hidden">
        <div className="flex justify-around px-2 py-2">
          {sidebarItems.slice(0, 5).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-[10px]",
                isItemActive(pathname, item.href, item.exact)
                  ? "text-[var(--primary)]"
                  : "text-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
