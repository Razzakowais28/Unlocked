import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  FileText,
  Image,
  Video,
  Mic,
  MapPin,
  FileType,
  Music,
  Gift,
  Target,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRelativeDate } from "@/lib/utils";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardPageHeader from "@/components/DashboardPageHeader";
import EmptyState from "@/components/EmptyState";
import GlassCard from "@/components/GlassCard";

const blockIcons: Record<string, typeof FileText> = {
  text: FileText,
  photo: Image,
  video: Video,
  audio: Mic,
  location: MapPin,
  memory: Brain,
  pdf: FileType,
  playlist: Music,
  gift: Gift,
  goal: Target,
};

export default async function MemoriesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const blocks = await prisma.capsuleBlock.findMany({
    where: { capsule: { userId: user.id } },
    include: { capsule: { select: { id: true, title: true, shareSlug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <DashboardPageHeader
          title="Memories"
          description={`${blocks.length} memory block${blocks.length === 1 ? "" : "s"} across your capsules`}
        />

        <div className="p-4 md:p-8">
          {blocks.length === 0 ? (
            <EmptyState
              title="No memories stored yet"
              description="Add text, photos, videos, and more to your capsules. Every block you save appears here."
              actionLabel="Create a capsule"
              actionHref="/capsules/new"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blocks.map((block) => {
                const Icon = blockIcons[block.type] ?? FileText;

                return (
                  <GlassCard key={block.id} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="icon-tile h-10 w-10 shrink-0">
                        <Icon className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted">
                          {block.type}
                        </p>
                        <h3 className="mt-0.5 truncate font-semibold text-foreground">
                          {block.title || "Untitled block"}
                        </h3>
                        {block.content && (
                          <p className="mt-2 line-clamp-3 text-sm text-muted">
                            {block.content}
                          </p>
                        )}
                        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted">
                          <Link
                            href={`/capsules/${block.capsule.id}/edit`}
                            className="truncate hover:text-[var(--primary)]"
                          >
                            {block.capsule.title}
                          </Link>
                          <span className="shrink-0">{formatRelativeDate(block.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
