"use client";

import { Lock, Unlock, FileEdit } from "lucide-react";
import GlassCard from "./GlassCard";
import GlowButton from "./GlowButton";
import CompactCountdown from "./CompactCountdown";
import { formatUnlockDateShort, getThemeGradient, isCapsuleUnlocked } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CapsuleCardProps {
  id: string;
  title: string;
  capsuleType: string;
  unlockDate: string | Date;
  isLocked: boolean;
  coverImageUrl?: string | null;
  theme?: string;
  shareSlug: string;
}

function StatusBadge({
  locked,
  unlocked,
}: {
  locked: boolean;
  unlocked: boolean;
}) {
  if (unlocked) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
        <Unlock className="h-3 w-3" />
        Unlocked
      </span>
    );
  }
  if (locked) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
        <Lock className="h-3 w-3" />
        Locked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
      <FileEdit className="h-3 w-3" />
      Draft
    </span>
  );
}

export default function CapsuleCard({
  id,
  title,
  capsuleType,
  unlockDate,
  isLocked,
  coverImageUrl,
  theme = "cosmic-night",
  shareSlug,
}: CapsuleCardProps) {
  const unlocked = isCapsuleUnlocked(unlockDate);
  const gradient = getThemeGradient(theme);
  const showCountdown = isLocked && !unlocked;

  return (
    <GlassCard hover className="flex h-full flex-col overflow-hidden">
      {/* Header — fixed height, consistent overlay */}
      <div className={cn("relative h-32 shrink-0 bg-gradient-to-br", gradient)}>
        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        <div className="relative flex h-full flex-col justify-between p-3">
          <StatusBadge locked={isLocked} unlocked={unlocked} />
          <span className="w-fit rounded-full border border-white/25 bg-black/45 px-2.5 py-0.5 text-[11px] font-medium capitalize text-white backdrop-blur-md">
            {capsuleType}
          </span>
        </div>
      </div>

      {/* Body — flex fill so all cards equal height */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-1 text-base font-semibold text-foreground sm:text-lg">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-muted sm:text-sm">
          {unlocked
            ? "Ready to open"
            : `Unlocks ${formatUnlockDateShort(unlockDate)}`}
        </p>

        {/* Countdown area — fixed height keeps cards aligned */}
        <div className="mt-4 min-h-[52px]">
          {showCountdown ? (
            <CompactCountdown unlockDate={unlockDate} />
          ) : !unlocked ? (
            <div className="flex h-[52px] items-center justify-center rounded-lg border border-dashed border-subtle bg-[var(--glass-bg)] px-3 text-center text-xs text-muted">
              Preview & lock to share countdown
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex gap-2">
          <GlowButton
            href={unlocked ? `/c/${shareSlug}/open` : `/c/${shareSlug}`}
            variant="secondary"
            className="flex-1 px-3 py-2 text-xs"
          >
            {unlocked ? "Open Capsule" : "View Countdown"}
          </GlowButton>
          <GlowButton
            href={`/capsules/${id}/edit`}
            variant="ghost"
            className="shrink-0 px-3 py-2 text-xs"
          >
            Edit
          </GlowButton>
        </div>
      </div>
    </GlassCard>
  );
}
