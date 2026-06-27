"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Gift,
  Target,
  Music,
  FileText,
  Play,
  Film,
  Download,
  Check,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { formatUnlockDate, getThemeGradient, isCapsuleUnlocked, normalizeMediaUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Block {
  id: string;
  type: string;
  title: string | null;
  content: string | null;
  mediaUrl: string | null;
  sortOrder: number;
}

interface Capsule {
  id: string;
  title: string;
  description: string | null;
  theme: string;
  unlockDate: string;
  coverImageUrl: string | null;
  blocks: Block[];
}

function Confetti() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    color: ["#8B5CF6", "#EC4899", "#38BDF8", "#A855F7"][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1 }}
          animate={{ y: "100vh", opacity: 0, rotate: 360 }}
          transition={{ duration: 3 + Math.random() * 2, delay: p.delay, ease: "linear" }}
          className="absolute h-2 w-2 rounded-full"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
    case "memory":
      return (
        <GlassCard className="p-8">
          <FileText className="h-5 w-5 text-[var(--primary)]" />
          <h3 className="mt-4 text-xl font-semibold">{block.title || "Letter"}</h3>
          <div className="mt-4 whitespace-pre-wrap font-serif text-lg leading-relaxed text-foreground">
            {block.content}
          </div>
        </GlassCard>
      );

    case "photo":
      return (
        <GlassCard className="overflow-hidden p-0">
          {block.mediaUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.mediaUrl}
              alt={block.title || "Photo"}
              className="max-h-[80vh] w-full bg-black/10 object-contain"
            />
          ) : (
            <div className="flex h-64 items-center justify-center bg-gradient-to-br from-violet-600/30 to-pink-500/30">
              <span className="text-muted">Photo placeholder</span>
            </div>
          )}
          {block.title && <p className="p-4 font-medium">{block.title}</p>}
        </GlassCard>
      );

    case "video":
      return (
        <GlassCard className="overflow-hidden p-0">
          {block.mediaUrl ? (
            <video src={block.mediaUrl} controls className="w-full" />
          ) : (
            <div className="flex h-64 items-center justify-center bg-gradient-to-br from-blue-500/30 to-violet-600/30">
              <span className="text-muted">Video placeholder</span>
            </div>
          )}
          {block.title && <p className="p-4 font-medium">{block.title}</p>}
        </GlassCard>
      );

    case "audio":
      return (
        <GlassCard className="p-6">
          <h3 className="font-semibold">{block.title || "Voice Note"}</h3>
          {block.mediaUrl ? (
            <audio src={block.mediaUrl} controls className="mt-4 w-full" />
          ) : (
            <div className="mt-4 flex h-16 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600/20 to-pink-500/20">
              <span className="text-sm text-muted">Audio placeholder</span>
            </div>
          )}
        </GlassCard>
      );

    case "pdf":
      return (
        <GlassCard className="p-6">
          <h3 className="font-semibold">{block.title || "Document"}</h3>
          {block.mediaUrl ? (
            <a
              href={block.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
            >
              <Download className="h-4 w-4" />
              Open PDF
            </a>
          ) : (
            <p className="mt-2 text-sm text-muted">PDF placeholder</p>
          )}
        </GlassCard>
      );

    case "playlist":
      return (
        <GlassCard className="p-6">
          <Music className="h-5 w-5 text-[var(--primary)]" />
          <h3 className="mt-3 font-semibold">{block.title || "Playlist"}</h3>
          {block.content && (
            <a href={block.content} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm text-[#38BDF8] hover:underline">
              {block.content}
            </a>
          )}
        </GlassCard>
      );

    case "location":
      return (
        <GlassCard className="p-6">
          <MapPin className="h-5 w-5 text-[#EC4899]" />
          <h3 className="mt-3 font-semibold">{block.title || "Location"}</h3>
          <p className="mt-2 text-muted">{block.content}</p>
        </GlassCard>
      );

    case "gift":
      return (
        <GlassCard className="p-8 text-center" glow>
          <Gift className="mx-auto h-10 w-10 text-[#EC4899]" />
          <h3 className="mt-4 text-xl font-semibold">{block.title || "A Surprise"}</h3>
          <p className="mt-4 text-muted">{block.content}</p>
        </GlassCard>
      );

    case "goal":
      return (
        <GlassCard className="p-6">
          <Target className="h-5 w-5 text-[#38BDF8]" />
          <h3 className="mt-3 font-semibold">{block.title || "Goals"}</h3>
          <ul className="mt-4 space-y-2">
            {(block.content || "").split("\n").filter(Boolean).map((goal, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      );

    default:
      return null;
  }
}

export default function OpenCapsulePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/capsules?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.capsule) {
          if (!isCapsuleUnlocked(data.capsule.unlockDate)) {
            router.replace(`/c/${slug}`);
            return;
          }
          setCapsule(data.capsule);
          if (data.capsule.blocks.length > 0) {
            setActiveBlock(data.capsule.blocks[0].id);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

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
        <Link href="/" className="text-[var(--primary)] hover:underline">Go home</Link>
      </div>
    );
  }

  const gradient = getThemeGradient(capsule.theme);
  const coverImageUrl = normalizeMediaUrl(capsule.coverImageUrl);
  const coverShownInBlocks = capsule.blocks.some(
    (block) => block.type === "photo" && normalizeMediaUrl(block.mediaUrl) === coverImageUrl
  );
  const showCoverPhoto = coverImageUrl && !coverShownInBlocks;

  return (
    <main className="relative min-h-screen">
      <Confetti />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("relative overflow-hidden bg-gradient-to-br py-16 text-center", gradient)}
      >
        {capsule.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={capsule.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-medium uppercase tracking-widest text-white/80"
          >
            Your capsule is unlocked
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-4xl font-bold md:text-6xl"
          >
            {capsule.title}
          </motion.h1>
          {capsule.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mx-auto mt-4 max-w-xl text-white/80"
            >
              {capsule.description}
            </motion.p>
          )}
          <p className="mt-4 text-sm text-white/60">
            Unlocked on {formatUnlockDate(capsule.unlockDate)}
          </p>
        </div>
      </motion.div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <GlassCard className="sticky top-8 p-4">
            <h3 className="mb-4 text-sm font-semibold text-muted">Contents</h3>
            <nav className="space-y-1">
              {showCoverPhoto && (
                <button
                  onClick={() => {
                    document.getElementById("cover-photo")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-[var(--glass-bg)] hover:text-foreground"
                >
                  Cover photo
                </button>
              )}
              {capsule.blocks.map((block) => (
                <button
                  key={block.id}
                  onClick={() => {
                    setActiveBlock(block.id);
                    document.getElementById(`block-${block.id}`)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    activeBlock === block.id
                      ? "nav-active"
                      : "text-muted hover:bg-[var(--glass-bg)] hover:text-foreground"
                  )}
                >
                  {block.title || block.type}
                </button>
              ))}
            </nav>
          </GlassCard>
        </aside>

        <div className="space-y-8 lg:col-span-3">
          {showCoverPhoto && (
            <motion.div
              id="cover-photo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="overflow-hidden p-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt={capsule.title}
                  className="max-h-[80vh] w-full bg-black/10 object-contain"
                />
                <p className="p-4 font-medium">Cover photo</p>
              </GlassCard>
            </motion.div>
          )}

          {/* AI Memory Movie placeholder */}
          <GlassCard className="overflow-hidden" glow>
            <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-violet-900/50 to-pink-900/50 md:h-64">
              <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent-pink)] px-3 py-1 text-xs font-semibold text-white">
                Premium
              </div>
              <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform hover:scale-110">
                <Play className="h-8 w-8 text-white" />
              </button>
            </div>
            <div className="flex items-center gap-3 p-5">
              <Film className="h-5 w-5 text-[var(--primary)]" />
              <div>
                <h3 className="font-semibold text-foreground">AI Memory Movie</h3>
                <p className="text-sm text-muted">Coming soon — turn your capsule into a cinematic reel</p>
              </div>
            </div>
          </GlassCard>

          {capsule.blocks.map((block, i) => (
            <motion.div
              key={block.id}
              id={`block-${block.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <BlockRenderer block={block} />
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="border-t border-subtle py-8 text-center text-sm text-muted">
        Created with <Link href="/" className="text-[var(--primary)] hover:underline">Unlocked</Link>
      </footer>
    </main>
  );
}
