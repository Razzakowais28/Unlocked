import { Sparkles } from "lucide-react";
import GlowButton from "./GlowButton";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="empty-dashed flex flex-col items-center justify-center rounded-2xl px-8 py-16 text-center">
      <div className="icon-tile mb-4 h-16 w-16">
        <Sparkles className="h-8 w-8 text-[var(--primary)]" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {actionLabel && actionHref && (
        <div className="mt-6">
          <GlowButton href={actionHref}>{actionLabel}</GlowButton>
        </div>
      )}
    </div>
  );
}
