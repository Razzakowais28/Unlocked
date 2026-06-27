"use client";

import {
  FileText,
  Image,
  Video,
  Mic,
  MapPin,
  Brain,
  FileType,
  Music,
  Gift,
  Target,
} from "lucide-react";
import { BLOCK_TYPES } from "@/lib/utils";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Image,
  Video,
  Mic,
  MapPin,
  Brain,
  FileType,
  Music,
  Gift,
  Target,
};

interface BlockPickerProps {
  onAdd: (type: string) => void;
  className?: string;
}

export default function BlockPicker({ onAdd, className }: BlockPickerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-sm font-semibold text-muted">Add memory block</h3>
      <div className="grid grid-cols-2 gap-2">
        {BLOCK_TYPES.map((block) => {
          const Icon = iconMap[block.icon];
          return (
            <button
              key={block.value}
              type="button"
              onClick={() => onAdd(block.value)}
              className="flex items-center gap-2 rounded-xl border border-subtle bg-[var(--glass-bg)] px-3 py-2.5 text-left text-sm transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--glass-bg-hover)]"
            >
              <Icon className="h-4 w-4 shrink-0 text-[var(--primary)]" />
              <span>{block.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
