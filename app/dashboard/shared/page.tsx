import { redirect } from "next/navigation";
import { Share2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardPageHeader from "@/components/DashboardPageHeader";
import EmptyState from "@/components/EmptyState";
import GlassCard from "@/components/GlassCard";

export default async function SharedWithMePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <DashboardPageHeader
          title="Shared with me"
          description="Capsules others have shared with you"
        />

        <div className="p-4 md:p-8">
          <GlassCard className="mb-8 p-5">
            <div className="flex items-start gap-4">
              <div className="icon-tile h-10 w-10 shrink-0">
                <Share2 className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">How sharing works</h2>
                <p className="mt-1 text-sm text-muted">
                  When someone shares a capsule link with you, it will appear here once
                  they grant you access. You can also open any shared link directly from
                  your inbox or messages.
                </p>
              </div>
            </div>
          </GlassCard>

          <EmptyState
            title="Nothing shared yet"
            description="When friends or family share a capsule with you, it will show up here so you can follow the countdown or open it when it unlocks."
            actionLabel="Create your own capsule"
            actionHref="/capsules/new"
          />
        </div>
      </main>
    </div>
  );
}
