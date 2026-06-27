"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, MessageCircle } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import { formatUnlockDate, formatUnlockDateShort, getThemeGradient, isCapsuleUnlocked } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Capsule {
  id: string;
  title: string;
  description: string | null;
  theme: string;
  unlockDate: string;
  coverImageUrl: string | null;
  shareSlug: string;
}

export default function CountdownPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    fetch(`/api/capsules?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.capsule) {
          setCapsule(data.capsule);
          setUnlocked(isCapsuleUnlocked(data.capsule.unlockDate));
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!capsule) return;
    const tick = () => setUnlocked(isCapsuleUnlocked(capsule.unlockDate));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [capsule]);

  if (loading) {
    return (
      <div className="countdown-page-bg flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="countdown-page-bg flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted">Capsule not found</p>
        <Link href="/" className="text-[var(--primary)] hover:underline">
          Go home
        </Link>
      </div>
    );
  }

  const gradient = getThemeGradient(capsule.theme);

  if (unlocked) {
    return (
      <main className="countdown-page-bg relative flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-sm font-medium uppercase tracking-widest text-muted">The wait is over</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">It&apos;s time 🎉</h1>
          <p className="mt-4 text-lg text-muted">Your capsule is now unlocked.</p>
          <div className="mt-8">
            <GlowButton href={`/c/${slug}/open`}>Open My Capsule</GlowButton>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="countdown-page-bg relative flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <GlassCard glow className="overflow-hidden">
          <div className="overflow-hidden">
            <div className={cn("relative h-40 bg-gradient-to-br sm:h-44", gradient)}>
            {capsule.coverImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={capsule.coverImageUrl}
                alt=""
                className="h-full w-full object-cover opacity-60"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg"
              >
                <Lock className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            </div>
          </div>

          <div className="px-4 py-6 text-center sm:px-8 sm:py-8">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-[var(--glass-bg)] px-3 py-1 text-xs font-medium text-muted">
              <Lock className="h-3 w-3" />
              Locked
            </div>

            <h1 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">{capsule.title}</h1>
            {capsule.description && (
              <p className="mt-2 text-sm text-muted">{capsule.description}</p>
            )}

            <div className="mt-6 rounded-2xl border border-[var(--card-border)] bg-[var(--glass-bg)] px-3 py-3 sm:px-4 sm:py-4">
              <p className="text-sm font-medium text-muted">This capsule is locked.</p>
              <p className="mt-1 text-sm text-foreground">
                Unlocks on{" "}
                <span className="font-semibold text-[var(--primary)]">
                  <span className="hidden sm:inline">{formatUnlockDate(capsule.unlockDate)}</span>
                  <span className="sm:hidden">{formatUnlockDateShort(capsule.unlockDate)}</span>
                </span>
              </p>
            </div>

            <div className="mx-auto mt-6 w-full max-w-sm sm:mt-8 sm:max-w-md">
              <CountdownTimer unlockDate={capsule.unlockDate} />
            </div>

            <div className="mt-8">
              <GlowButton
                variant="secondary"
                className="w-full"
                onClick={() => alert("Messages coming soon!")}
              >
                <MessageCircle className="h-4 w-4" />
                Leave a message
              </GlowButton>
            </div>
          </div>
        </GlassCard>

        <p className="mt-8 text-center text-xs text-muted">
          Created with{" "}
          <Link href="/" className="text-[var(--primary)] hover:underline">
            Unlocked
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
