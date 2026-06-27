import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import CapsuleCard from "@/components/CapsuleCard";
import EmptyState from "@/components/EmptyState";
import GlowButton from "@/components/GlowButton";
import GlassCard from "@/components/GlassCard";
import { getGreeting, isCapsuleUnlocked } from "@/lib/utils";
import { Box, Lock, Clock, Brain, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const capsules = await prisma.capsule.findMany({
    where: { userId: user.id },
    orderBy: { unlockDate: "asc" },
  });

  const totalCapsules = capsules.length;
  const lockedCapsules = capsules.filter(
    (c) => c.isLocked && !isCapsuleUnlocked(c.unlockDate)
  ).length;
  const upcomingUnlocks = capsules.filter(
    (c) => !isCapsuleUnlocked(c.unlockDate)
  ).length;
  const memoriesStored = await prisma.capsuleBlock.count({
    where: { capsule: { userId: user.id } },
  });

  const upcoming = capsules.filter((c) => !isCapsuleUnlocked(c.unlockDate));

  const stats = [
    { label: "Total capsules", value: totalCapsules, icon: Box },
    { label: "Locked capsules", value: lockedCapsules, icon: Lock },
    { label: "Upcoming unlocks", value: upcomingUnlocks, icon: Clock },
    { label: "Memories stored", value: memoriesStored, icon: Brain },
  ];

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <DashboardHeader greeting={getGreeting(user.name)} />

        <div className="p-4 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <GlassCard key={stat.label} className="p-5">
                <div className="flex items-center justify-between">
                  <stat.icon className="h-5 w-5 text-[var(--primary)]" />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </GlassCard>
            ))}
          </div>

          <div className="mt-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Upcoming unlocks</h2>
              <Link href="/capsules/new" className="md:hidden">
                <GlowButton className="px-4 py-2 text-xs">
                  <Plus className="h-3 w-3" />
                  New
                </GlowButton>
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <EmptyState
                title="No capsules yet"
                description="Create your first time capsule and start preserving memories for the future."
                actionLabel="Create your capsule"
                actionHref="/capsules/new"
              />
            ) : (
              <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((capsule) => (
                  <CapsuleCard
                    key={capsule.id}
                    id={capsule.id}
                    title={capsule.title}
                    capsuleType={capsule.capsuleType}
                    unlockDate={capsule.unlockDate}
                    isLocked={capsule.isLocked}
                    coverImageUrl={capsule.coverImageUrl}
                    theme={capsule.theme}
                    shareSlug={capsule.shareSlug}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
