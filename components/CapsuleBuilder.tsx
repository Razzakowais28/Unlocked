"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Trash2, GripVertical } from "lucide-react";
import GlassCard from "./GlassCard";
import BlockPicker from "./BlockPicker";
import FileUploader from "./FileUploader";
import { CapsuleBlockInput } from "@/lib/validators";
import { BLOCK_TYPES } from "@/lib/utils";

interface CapsuleBuilderProps {
  blocks: CapsuleBlockInput[];
  onChange: (blocks: CapsuleBlockInput[]) => void;
}

function BlockEditor({
  block,
  index,
  total,
  onUpdate,
  onDelete,
  onMove,
}: {
  block: CapsuleBlockInput;
  index: number;
  total: number;
  onUpdate: (block: CapsuleBlockInput) => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
}) {
  const blockLabel = BLOCK_TYPES.find((b) => b.value === block.type)?.label ?? block.type;
  const needsMedia = ["photo", "video", "audio", "pdf"].includes(block.type);

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted" />
          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-[var(--primary-bright)]">
            {blockLabel}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove("up")}
            disabled={index === 0}
            className="rounded p-1 text-muted hover:bg-[var(--glass-bg-hover)] disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove("down")}
            disabled={index === total - 1}
            className="rounded p-1 text-muted hover:bg-[var(--glass-bg-hover)] disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded p-1 text-red-400 hover:bg-red-400/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <input
          type="text"
          placeholder="Block title"
          value={block.title ?? ""}
          onChange={(e) => onUpdate({ ...block, title: e.target.value })}
          className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
        />

        {block.type === "text" && (
          <textarea
            placeholder="Write your letter..."
            value={block.content ?? ""}
            onChange={(e) => onUpdate({ ...block, content: e.target.value })}
            rows={5}
            className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
          />
        )}

        {block.type === "memory" && (
          <textarea
            placeholder="Describe this memory..."
            value={block.content ?? ""}
            onChange={(e) => onUpdate({ ...block, content: e.target.value })}
            rows={4}
            className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
          />
        )}

        {block.type === "location" && (
          <input
            type="text"
            placeholder="Location (e.g. Paris, France)"
            value={block.content ?? ""}
            onChange={(e) => onUpdate({ ...block, content: e.target.value })}
            className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
          />
        )}

        {block.type === "playlist" && (
          <input
            type="url"
            placeholder="Playlist URL (Spotify, Apple Music...)"
            value={block.content ?? ""}
            onChange={(e) => onUpdate({ ...block, content: e.target.value })}
            className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
          />
        )}

        {block.type === "gift" && (
          <textarea
            placeholder="Gift note or surprise message..."
            value={block.content ?? ""}
            onChange={(e) => onUpdate({ ...block, content: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
          />
        )}

        {block.type === "goal" && (
          <textarea
            placeholder="Goals (one per line)&#10;Learn guitar&#10;Travel to Japan&#10;Run a marathon"
            value={block.content ?? ""}
            onChange={(e) => onUpdate({ ...block, content: e.target.value })}
            rows={5}
            className="w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
          />
        )}

        {needsMedia && (
          <FileUploader
            accept={
              block.type === "photo"
                ? "image/*"
                : block.type === "video"
                  ? "video/*"
                  : block.type === "audio"
                    ? "audio/*"
                    : ".pdf"
            }
            currentUrl={block.mediaUrl}
            onUpload={(url) => onUpdate({ ...block, mediaUrl: url })}
            label={`Upload ${block.type}`}
          />
        )}
      </div>
    </GlassCard>
  );
}

export default function CapsuleBuilder({ blocks, onChange }: CapsuleBuilderProps) {
  const [panelOpen, setPanelOpen] = useState(false);

  const addBlock = (type: string) => {
    onChange([
      ...blocks,
      {
        type: type as CapsuleBlockInput["type"],
        title: "",
        content: "",
        mediaUrl: "",
        sortOrder: blocks.length,
      },
    ]);
    setPanelOpen(false);
  };

  const updateBlock = (index: number, block: CapsuleBlockInput) => {
    const updated = [...blocks];
    updated[index] = block;
    onChange(updated);
  };

  const deleteBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const updated = [...blocks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated.map((b, i) => ({ ...b, sortOrder: i })));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h2 className="text-xl font-semibold">Your memories</h2>
        {blocks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-subtle p-12 text-center">
            <p className="text-muted">No memories yet. Add your first block.</p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <BlockEditor
              key={index}
              block={block}
              index={index}
              total={blocks.length}
              onUpdate={(b) => updateBlock(index, b)}
              onDelete={() => deleteBlock(index)}
              onMove={(dir) => moveBlock(index, dir)}
            />
          ))
        )}
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <button
          type="button"
          className="mb-4 w-full rounded-xl border border-subtle bg-[var(--glass-bg)] px-4 py-3 text-sm font-medium lg:hidden"
          onClick={() => setPanelOpen(!panelOpen)}
        >
          {panelOpen ? "Hide block picker" : "Add memory block"}
        </button>
        <div className={`${panelOpen ? "block" : "hidden"} lg:block`}>
          <GlassCard className="p-5">
            <BlockPicker onAdd={addBlock} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
