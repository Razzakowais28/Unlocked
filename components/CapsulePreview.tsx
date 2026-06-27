"use client";

import { Lock, Calendar, Share2 } from "lucide-react";
import GlassCard from "./GlassCard";
import GlowButton from "./GlowButton";
import { formatUnlockDate, getThemeGradient } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CapsulePreviewProps {
  title: string;
  description?: string | null;
  theme: string;
  unlockDate: string | Date;
  coverImageUrl?: string | null;
  blocks: Array<{
    id?: string;
    type: string;
    title?: string | null;
    content?: string | null;
    mediaUrl?: string | null;
  }>;
  shareSlug?: string;
  onLock?: () => void;
  locking?: boolean;
  isLocked?: boolean;
}

export default function CapsulePreview({
  title,
  description,
  theme,
  unlockDate,
  coverImageUrl,
  blocks,
  shareSlug,
  onLock,
  locking = false,
  isLocked = false,
}: CapsulePreviewProps) {
  const gradient = getThemeGradient(theme);

  return (
    <div className="space-y-6">
      <GlassCard className="overflow-hidden">
        <div className={cn("relative h-48 bg-gradient-to-br md:h-64", gradient)}>
          {coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImageUrl} alt={title} className="h-full w-full object-cover opacity-70" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
            {description && <p className="mt-2 text-sm text-white/80">{description}</p>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 p-6">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Calendar className="h-4 w-4" />
            Unlocks {formatUnlockDate(unlockDate)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <Lock className="h-4 w-4" />
            {isLocked ? "Locked" : "Draft"}
          </div>
          {shareSlug && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Share2 className="h-4 w-4" />
              /c/{shareSlug}
            </div>
          )}
        </div>
      </GlassCard>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Memory blocks ({blocks.length})</h2>
        {blocks.map((block, i) => (
          <GlassCard key={block.id ?? i} className="p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]">
              {block.type}
            </span>
            <h3 className="mt-1 font-medium text-foreground">{block.title || "Untitled"}</h3>
            {block.content && (
              <p className="mt-2 line-clamp-2 text-sm text-muted">{block.content}</p>
            )}
            {block.type === "photo" && block.mediaUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={block.mediaUrl}
                alt={block.title || "Photo"}
                className="mt-3 max-h-48 w-full rounded-xl object-cover"
              />
            )}
            {block.type === "video" && block.mediaUrl && (
              <video src={block.mediaUrl} controls className="mt-3 max-h-48 w-full rounded-xl" />
            )}
            {block.type === "audio" && block.mediaUrl && (
              <audio src={block.mediaUrl} controls className="mt-3 w-full" />
            )}
            {block.mediaUrl && block.type !== "photo" && block.type !== "video" && block.type !== "audio" && (
              <p className="mt-1 text-xs text-muted">Media attached</p>
            )}
          </GlassCard>
        ))}
      </div>

      {onLock && !isLocked && (
        <GlowButton onClick={onLock} disabled={locking} className="w-full md:w-auto">
          <Lock className="mr-2 h-4 w-4" />
          {locking ? "Locking..." : "Lock Capsule"}
        </GlowButton>
      )}
    </div>
  );
}
