import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, Lock, Palette, Shield } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardPageHeader from "@/components/DashboardPageHeader";
import GlassCard from "@/components/GlassCard";
import LogoutButton from "@/components/LogoutButton";

const settingsSections = [
  {
    icon: Palette,
    title: "Appearance",
    description: "Light and dark mode can be changed on the home page",
    control: (
      <Link
        href="/"
        className="rounded-full border border-subtle px-3 py-1 text-xs font-medium text-[var(--primary)] hover:bg-[var(--glass-bg)]"
      >
        Go to home
      </Link>
    ),
  },
  {
    icon: Bell,
    title: "Unlock reminders",
    description: "Get notified when a capsule is about to unlock",
    control: (
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" defaultChecked className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-[var(--glass-bg)] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[var(--primary)] peer-checked:after:translate-x-full" />
      </label>
    ),
  },
  {
    icon: Lock,
    title: "Default lock behavior",
    description: "New capsules are locked by default when shared",
    control: (
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" defaultChecked className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-[var(--glass-bg)] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[var(--primary)] peer-checked:after:translate-x-full" />
      </label>
    ),
  },
  {
    icon: Shield,
    title: "Privacy",
    description: "Your capsules are private until you share the link",
    control: (
      <span className="rounded-full border border-subtle px-3 py-1 text-xs text-muted">
        Enabled
      </span>
    ),
  },
];

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <DashboardPageHeader
          title="Settings"
          description="Manage your preferences and account options"
        />

        <div className="p-4 md:p-8">
          <div className="mx-auto max-w-2xl space-y-4">
            {settingsSections.map((section) => (
              <GlassCard key={section.title} className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="icon-tile h-10 w-10 shrink-0">
                      <section.icon className="h-5 w-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{section.title}</h3>
                      <p className="mt-1 text-sm text-muted">{section.description}</p>
                    </div>
                  </div>
                  <div className="shrink-0">{section.control}</div>
                </div>
              </GlassCard>
            ))}
            <GlassCard className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-foreground">Sign out</h3>
                  <p className="mt-1 text-sm text-muted">Log out of your account on this device</p>
                </div>
                <LogoutButton />
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
