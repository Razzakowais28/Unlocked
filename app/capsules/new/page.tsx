"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Users,
  Heart,
  Smile,
  Briefcase,
  GraduationCap,
  Cake,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import CapsuleBuilder from "@/components/CapsuleBuilder";
import FileUploader from "@/components/FileUploader";
import { CAPSULE_TYPES, THEMES } from "@/lib/utils";
import { CapsuleBlockInput } from "@/lib/validators";
import { addYears, format } from "date-fns";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Users,
  Heart,
  Smile,
  Briefcase,
  GraduationCap,
  Cake,
  Sparkles,
};

const quickDates = [
  { label: "1 year", years: 1 },
  { label: "5 years", years: 5 },
  { label: "10 years", years: 10 },
  { label: "20 years", years: 20 },
];

export default function NewCapsulePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        </div>
      }
    >
      <NewCapsuleContent />
    </Suspense>
  );
}

function NewCapsuleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [capsuleType, setCapsuleType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("cosmic-night");

  useEffect(() => {
    const type = searchParams.get("type");
    const themeParam = searchParams.get("theme");
    if (type && CAPSULE_TYPES.some((t) => t.value === type)) {
      setCapsuleType(type);
    }
    if (themeParam && THEMES.some((t) => t.value === themeParam)) {
      setTheme(themeParam);
    }
  }, [searchParams]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [unlockTime, setUnlockTime] = useState("12:00");
  const [blocks, setBlocks] = useState<CapsuleBlockInput[]>([]);

  const setQuickDate = (years: number) => {
    const date = addYears(new Date(), years);
    setUnlockDate(format(date, "yyyy-MM-dd"));
    setUnlockTime(format(date, "HH:mm"));
  };

  const canProceed = () => {
    if (step === 1) return !!capsuleType;
    if (step === 2) return title.trim().length > 0;
    if (step === 3) return !!unlockDate;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const dateTime = new Date(`${unlockDate}T${unlockTime}`);
    if (dateTime <= new Date()) {
      setError("Unlock date must be in the future");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          capsuleType,
          theme,
          coverImageUrl: coverImageUrl || undefined,
          unlockDate: dateTime.toISOString(),
          blocks,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create capsule");

      router.push(`/capsules/${data.capsule.id}/preview`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create capsule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-subtle px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 w-8 rounded-full transition-colors",
                  s <= step ? "step-dot-active" : "step-dot-inactive"
                )}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold md:text-3xl">Choose capsule type</h1>
              <p className="mt-2 text-muted">What kind of memories will you preserve?</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {CAPSULE_TYPES.map((type) => {
                  const Icon = iconMap[type.icon];
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setCapsuleType(type.value)}
                      className={cn(
                        "rounded-2xl border p-5 text-left transition-all",
                        capsuleType === type.value
                          ? "border-[var(--primary)] bg-primary-soft"
                          : "border-subtle bg-[var(--glass-bg)] hover:border-subtle"
                      )}
                    >
                      <Icon className="h-6 w-6 text-[var(--primary)]" />
                      <h3 className="mt-3 font-semibold">{type.label}</h3>
                      <p className="mt-1 text-sm text-muted">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold md:text-3xl">Basic information</h1>
              <p className="mt-2 text-muted">Give your capsule a name and look.</p>
              <div className="mt-8 space-y-6">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Capsule title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My 2030 Goals"
                    className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-3 outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A message for my future self..."
                    rows={3}
                    className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-3 outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium">Theme</label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {THEMES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTheme(t.value)}
                        className={cn(
                          "overflow-hidden rounded-xl border transition-all",
                          theme === t.value ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30" : "border-subtle"
                        )}
                      >
                        <div className={cn("h-16 bg-gradient-to-br", t.gradient)} />
                        <p className="p-2 text-xs font-medium">{t.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Cover image</label>
                  <FileUploader
                    accept="image/*"
                    currentUrl={coverImageUrl}
                    onUpload={setCoverImageUrl}
                    label="Upload cover image"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold md:text-3xl">Choose unlock date</h1>
              <p className="mt-2 text-muted">When should this capsule open?</p>
              <div className="mt-8 space-y-6">
                <div className="flex flex-wrap gap-3">
                  {quickDates.map((qd) => (
                    <button
                      key={qd.label}
                      type="button"
                      onClick={() => setQuickDate(qd.years)}
                      className="rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-2 text-sm hover:border-[var(--primary)]/50"
                    >
                      {qd.label}
                    </button>
                  ))}
                </div>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="h-5 w-5 text-[var(--primary)]" />
                    <span className="font-medium">Custom date</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm">Date</label>
                      <input
                        type="date"
                        value={unlockDate}
                        onChange={(e) => setUnlockDate(e.target.value)}
                        min={format(new Date(), "yyyy-MM-dd")}
                        className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-3 outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm">Time</label>
                      <input
                        type="time"
                        value={unlockTime}
                        onChange={(e) => setUnlockTime(e.target.value)}
                        className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-3 outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold md:text-3xl">Add memories</h1>
              <p className="mt-2 text-muted">
                Create letters, photos, videos, voice notes, goals, and surprises.
              </p>
              <div className="mt-8">
                <CapsuleBuilder blocks={blocks} onChange={setBlocks} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-10 flex justify-between">
          <GlowButton
            variant="secondary"
            onClick={() => setStep(step - 1)}
            className={step === 1 ? "invisible" : ""}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </GlowButton>

          {step < 4 ? (
            <GlowButton
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </GlowButton>
          ) : (
            <GlowButton onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create Capsule"}
            </GlowButton>
          )}
        </div>
      </main>
    </div>
  );
}
