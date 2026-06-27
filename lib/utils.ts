import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, isBefore } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const CAPSULE_TYPES = [
  { value: "personal", label: "Personal", description: "A capsule just for you", icon: "User" },
  { value: "family", label: "Family", description: "Share memories with loved ones", icon: "Users" },
  { value: "couple", label: "Couple", description: "Celebrate your journey together", icon: "Heart" },
  { value: "friends", label: "Friends", description: "Inside jokes and adventures", icon: "Smile" },
  { value: "business", label: "Business", description: "Milestones and vision", icon: "Briefcase" },
  { value: "graduation", label: "Graduation", description: "Mark a new chapter", icon: "GraduationCap" },
  { value: "birthday", label: "Birthday", description: "A surprise for their special day", icon: "Cake" },
  { value: "other", label: "Other", description: "Something uniquely yours", icon: "Sparkles" },
] as const;

export const THEMES = [
  { value: "cosmic-night", label: "Cosmic Night", gradient: "from-violet-600 via-purple-700 to-indigo-900" },
  { value: "sunset-memory", label: "Sunset Memory", gradient: "from-orange-500 via-pink-500 to-purple-700" },
  { value: "vintage-paper", label: "Vintage Paper", gradient: "from-amber-700 via-orange-800 to-stone-900" },
  { value: "wedding-glow", label: "Wedding Glow", gradient: "from-rose-400 via-pink-500 to-violet-600" },
  { value: "minimal-dark", label: "Minimal Dark", gradient: "from-slate-800 via-gray-900 to-black" },
  { value: "dream-sky", label: "Dream Sky", gradient: "from-sky-400 via-blue-500 to-indigo-700" },
] as const;

export const BLOCK_TYPES = [
  { value: "text", label: "Text", icon: "FileText" },
  { value: "photo", label: "Photo", icon: "Image" },
  { value: "video", label: "Video", icon: "Video" },
  { value: "audio", label: "Audio", icon: "Mic" },
  { value: "location", label: "Location", icon: "MapPin" },
  { value: "memory", label: "Memory", icon: "Brain" },
  { value: "pdf", label: "PDF", icon: "FileType" },
  { value: "playlist", label: "Playlist", icon: "Music" },
  { value: "gift", label: "Gift", icon: "Gift" },
  { value: "goal", label: "Goal", icon: "Target" },
] as const;

export type CapsuleTypeValue = (typeof CAPSULE_TYPES)[number]["value"];
export type ThemeValue = (typeof THEMES)[number]["value"];
export type BlockTypeValue = (typeof BLOCK_TYPES)[number]["value"];

export function getThemeGradient(theme: string) {
  return THEMES.find((t) => t.value === theme)?.gradient ?? THEMES[0].gradient;
}

export function formatUnlockDate(date: Date | string) {
  return format(new Date(date), "MMMM d, yyyy 'at' h:mm a");
}

export function formatUnlockDateShort(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy · h:mm a");
}

export function formatRelativeDate(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isCapsuleUnlocked(unlockDate: Date | string) {
  return !isBefore(new Date(), new Date(unlockDate));
}

export function isCapsuleLocked(unlockDate: Date | string, isLocked?: boolean) {
  if (isLocked === false && isCapsuleUnlocked(unlockDate)) return false;
  return isBefore(new Date(), new Date(unlockDate)) || isLocked !== false;
}

export function getTimeRemaining(unlockDate: Date | string) {
  const target = new Date(unlockDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

export function normalizeMediaUrl(url?: string | null) {
  if (!url?.trim()) return null;
  return url.trim();
}

export function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

export function getGreeting(name: string) {
  const hour = new Date().getHours();
  const firstName = name.split(" ")[0];
  if (hour < 12) return `Good morning, ${firstName} 👋`;
  if (hour < 17) return `Good afternoon, ${firstName} 👋`;
  return `Good evening, ${firstName} 👋`;
}
