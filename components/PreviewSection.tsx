import MobilePreview from "./MobilePreview";

export default function PreviewSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-5xl">See it in action</h2>
          <p className="mt-4 text-muted">Open it when the future arrives.</p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
          <MobilePreview title="Dashboard">
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-white/20" />
              <div className="h-16 rounded-lg bg-gradient-to-br from-violet-600/40 to-purple-800/40" />
              <div className="h-16 rounded-lg bg-gradient-to-br from-pink-500/30 to-violet-600/30" />
            </div>
          </MobilePreview>
          <MobilePreview title="Create Capsule">
            <div className="space-y-2">
              <div className="h-8 rounded-lg border border-subtle bg-[var(--glass-bg)]" />
              <div className="grid grid-cols-2 gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-10 rounded bg-[var(--glass-bg)]" />
                ))}
              </div>
            </div>
          </MobilePreview>
          <MobilePreview title="Countdown">
            <div className="flex flex-col items-center justify-center pt-8">
              <div className="h-8 w-8 rounded-lg bg-[var(--primary)]/40" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-8 w-10 rounded bg-white/10" />
                ))}
              </div>
            </div>
          </MobilePreview>
          <MobilePreview title="Unlock Day">
            <div className="space-y-2 pt-4">
              <div className="text-center text-xs gradient-text">Unlocked!</div>
              <div className="h-20 rounded-lg bg-gradient-to-br from-violet-500/30 to-pink-500/30" />
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-3/4 rounded bg-white/10" />
            </div>
          </MobilePreview>
        </div>
      </div>
    </section>
  );
}
