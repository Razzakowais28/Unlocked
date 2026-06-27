"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CapsuleBuilder from "@/components/CapsuleBuilder";
import GlowButton from "@/components/GlowButton";
import FileUploader from "@/components/FileUploader";
import { THEMES } from "@/lib/utils";
import { CapsuleBlockInput } from "@/lib/validators";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Capsule {
  id: string;
  title: string;
  description: string | null;
  theme: string;
  unlockDate: string;
  coverImageUrl: string | null;
  capsuleType: string;
  blocks: CapsuleBlockInput[];
}

export default function EditCapsulePage() {
  const params = useParams();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("cosmic-night");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [unlockTime, setUnlockTime] = useState("12:00");
  const [blocks, setBlocks] = useState<CapsuleBlockInput[]>([]);

  useEffect(() => {
    fetch(`/api/capsules/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.capsule) {
          const c = data.capsule;
          setCapsule(c);
          setTitle(c.title);
          setDescription(c.description || "");
          setTheme(c.theme);
          setCoverImageUrl(c.coverImageUrl || "");
          setUnlockDate(format(new Date(c.unlockDate), "yyyy-MM-dd"));
          setUnlockTime(format(new Date(c.unlockDate), "HH:mm"));
          setBlocks(c.blocks);
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleSave = async () => {
    if (!capsule) return;
    setSaving(true);
    setError(null);

    const dateTime = new Date(`${unlockDate}T${unlockTime}`);

    try {
      const res = await fetch(`/api/capsules/${capsule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          theme,
          coverImageUrl: coverImageUrl || undefined,
          unlockDate: dateTime.toISOString(),
          blocks,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      window.location.href = `/capsules/${capsule.id}/preview`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted">Capsule not found</p>
        <Link href="/dashboard" className="text-[var(--primary)] hover:underline">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="header-bar px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="link-muted flex items-center gap-2 text-sm hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <h1 className="text-2xl font-bold text-foreground">Edit Capsule</h1>
        <div className="mt-8 space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-3 outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-3 outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div>
            <label className="mb-3 block text-sm font-medium">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    "overflow-hidden rounded-xl border",
                    theme === t.value ? "border-[var(--primary)]" : "border-subtle"
                  )}
                >
                  <div className={cn("h-12 bg-gradient-to-br", t.gradient)} />
                  <p className="p-2 text-xs">{t.label}</p>
                </button>
              ))}
            </div>
          </div>
          <FileUploader accept="image/*" currentUrl={coverImageUrl} onUpload={setCoverImageUrl} label="Cover image" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm">Unlock date</label>
              <input
                type="date"
                value={unlockDate}
                onChange={(e) => setUnlockDate(e.target.value)}
                className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-3 outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm">Time</label>
              <input
                type="time"
                value={unlockTime}
                onChange={(e) => setUnlockTime(e.target.value)}
                className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-3 outline-none"
              />
            </div>
          </div>
          <CapsuleBuilder blocks={blocks} onChange={setBlocks} />
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <div className="mt-8">
          <GlowButton onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </GlowButton>
        </div>
      </main>
    </div>
  );
}
