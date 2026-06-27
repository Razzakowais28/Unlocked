"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  unlockDate: Date | string;
  size?: "sm" | "lg";
}

function TimeUnit({
  value,
  label,
  size,
}: {
  value: number;
  label: string;
  size: "sm" | "lg";
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={{ scale: 0.92, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "countdown-unit flex w-full items-center justify-center rounded-xl font-bold tabular-nums backdrop-blur-sm",
            size === "lg"
              ? "h-14 text-xl sm:h-16 sm:text-2xl md:h-20 md:text-3xl lg:h-24 lg:text-4xl"
              : "h-12 text-lg sm:h-14 sm:text-xl"
          )}
        >
          {String(value).padStart(2, "0")}
        </motion.div>
      </AnimatePresence>
      <span
        className={cn(
          "mt-1.5 font-medium uppercase tracking-wider text-muted",
          size === "lg" ? "text-[10px] sm:text-xs" : "text-[9px] sm:text-[10px]"
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ unlockDate, size = "lg" }: CountdownTimerProps) {
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
    return (
      <div
        className={cn("w-full", size === "lg" ? "h-[72px] sm:h-20 md:h-24" : "h-14")}
        aria-hidden
      />
    );
  }

  if (time.expired) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold gradient-text">It&apos;s time! 🎉</p>
      </div>
    );
  }

  return (
    <div
      className="grid w-full grid-cols-4 gap-1.5 sm:gap-2 md:gap-3"
      role="timer"
      aria-live="polite"
      aria-label={`${time.days} days, ${time.hours} hours, ${time.minutes} minutes, ${time.seconds} seconds remaining`}
    >
      <TimeUnit value={time.days} label="Days" size={size} />
      <TimeUnit value={time.hours} label="Hours" size={size} />
      <TimeUnit value={time.minutes} label="Min" size={size} />
      <TimeUnit value={time.seconds} label="Sec" size={size} />
    </div>
  );
}
