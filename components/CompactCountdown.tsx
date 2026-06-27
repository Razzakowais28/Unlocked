"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CompactCountdownProps {
  unlockDate: Date | string;
  className?: string;
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center rounded-lg border border-[var(--card-border)] bg-[var(--countdown-unit-bg)] px-1 py-2">
      <span className="text-lg font-bold tabular-nums leading-none text-foreground sm:text-xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[9px] font-medium uppercase tracking-wide text-muted">
        {label}
      </span>
    </div>
  );
}

export default function CompactCountdown({ unlockDate, className }: CompactCountdownProps) {
  const [time, setTime] = useState(getTimeRemaining(unlockDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => setTime(getTimeRemaining(unlockDate));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [unlockDate]);

  if (!mounted) {
    return <div className={cn("h-[52px]", className)} aria-hidden />;
  }

  if (time.expired) {
    return (
      <div className={cn("rounded-lg bg-primary-soft py-2 text-center text-sm font-semibold text-[var(--primary)]", className)}>
        Ready to open 🎉
      </div>
    );
  }

  return (
    <div
      className={cn("grid grid-cols-4 gap-1.5", className)}
      role="timer"
      aria-live="polite"
    >
      <Unit value={time.days} label="Days" />
      <Unit value={time.hours} label="Hrs" />
      <Unit value={time.minutes} label="Min" />
      <Unit value={time.seconds} label="Sec" />
    </div>
  );
}
