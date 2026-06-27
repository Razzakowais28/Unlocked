import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardPageHeader from "@/components/DashboardPageHeader";
import CapsuleCard from "@/components/CapsuleCard";
import EmptyState from "@/components/EmptyState";
import GlowButton from "@/components/GlowButton";

export default async function MyCapsulesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const capsules = await prisma.capsule.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <DashboardPageHeader
          title="My Capsules"
          description={`${capsules.length} capsule${capsules.length === 1 ? "" : "s"} in your vault`}
        />

        <div className="p-4 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted">
              All your time capsules, drafts, and locked memories.
            </p>
            <Link href="/capsules/new" className="hidden md:block">
              <GlowButton>
                <Plus className="h-4 w-4" />
                New Capsule
              </GlowButton>
            </Link>
          </div>

          {capsules.length === 0 ? (
            <EmptyState
              title="No capsules yet"
              description="Create your first time capsule and start preserving memories for the future."
              actionLabel="Create your capsule"
              actionHref="/capsules/new"
            />
          ) : (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {capsules.map((capsule) => (
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
      </main>
    </div>
  );
}
