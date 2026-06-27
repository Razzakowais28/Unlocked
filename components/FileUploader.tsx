"use client";

import { useCallback, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  accept?: string;
  onUpload: (url: string) => void;
  currentUrl?: string;
  label?: string;
}

export default function FileUploader({
  accept = "image/*,video/*,audio/*,.pdf",
  onUpload,
  currentUrl,
  label = "Upload file",
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        onUpload(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const isImage =
    !!currentUrl &&
    (/\.(jpg|jpeg|png|gif|webp)$/i.test(currentUrl) || currentUrl.startsWith("/uploads/"));
  const isVideo = currentUrl?.match(/\.(mp4|webm|mov)$/i);
  const isAudio = currentUrl?.match(/\.(mp3|wav|ogg|m4a)$/i);

  return (
    <div className="space-y-2">
      {currentUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-subtle bg-[var(--glass-bg)]">
          {isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt="Upload preview" className="h-40 w-full object-cover" />
          )}
          {isVideo && (
            <video src={currentUrl} controls className="h-40 w-full object-cover" />
          )}
          {isAudio && (
            <div className="p-4">
              <audio src={currentUrl} controls className="w-full" />
            </div>
          )}
          {!isImage && !isVideo && !isAudio && (
            <div className="flex h-20 items-center justify-center p-4 text-sm text-muted">
              File uploaded: {currentUrl.split("/").pop()}
            </div>
          )}
          <button
            type="button"
            onClick={() => onUpload("")}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-subtle bg-[var(--glass-bg)] p-8 transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--glass-bg-hover)]",
            uploading && "pointer-events-none opacity-50"
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          ) : (
            <Upload className="h-8 w-8 text-[var(--primary)]" />
          )}
          <span className="mt-2 text-sm font-medium">{label}</span>
          <span className="mt-1 text-xs text-muted">Max 50MB • Images, video, audio, PDF</span>
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </label>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <p className="text-xs text-muted">
        Local storage only for demo. Production should use S3/R2.
      </p>
    </div>
  );
}
