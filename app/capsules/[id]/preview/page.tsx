"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CapsulePreview from "@/components/CapsulePreview";

interface Capsule {
  id: string;
  title: string;
  description: string | null;
  theme: string;
  unlockDate: string;
  coverImageUrl: string | null;
  shareSlug: string;
  isLocked: boolean;
  blocks: Array<{
    id: string;
    type: string;
    title: string | null;
    content: string | null;
    mediaUrl: string | null;
  }>;
}

export default function CapsulePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);

  useEffect(() => {
    fetch(`/api/capsules/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.capsule) setCapsule(data.capsule);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleLock = async () => {
    if (!capsule) return;
    setLocking(true);

    try {
      const res = await fetch(`/api/capsules/${capsule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLocked: true }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push(`/c/${capsule.shareSlug}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLocking(false);
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
        <Link href="/dashboard" className="text-[var(--primary)] hover:underline">
          Back to dashboard
        </Link>
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
      <main className="mx-auto max-w-3xl px-4 py-8 md:px-8">
        <h1 className="mb-8 text-2xl font-bold text-foreground">Capsule Preview</h1>
        <CapsulePreview
          title={capsule.title}
          description={capsule.description}
          theme={capsule.theme}
          unlockDate={capsule.unlockDate}
          coverImageUrl={capsule.coverImageUrl}
          blocks={capsule.blocks}
          shareSlug={capsule.shareSlug}
          onLock={handleLock}
          locking={locking}
          isLocked={capsule.isLocked}
        />
      </main>
    </div>
  );
}
