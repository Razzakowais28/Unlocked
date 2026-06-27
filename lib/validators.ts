import { z } from "zod";

export const capsuleTypes = [
  "personal",
  "family",
  "couple",
  "friends",
  "business",
  "graduation",
  "birthday",
  "other",
] as const;

export const blockTypes = [
  "text",
  "photo",
  "video",
  "audio",
  "location",
  "memory",
  "pdf",
  "playlist",
  "gift",
  "goal",
] as const;

export const themes = [
  "cosmic-night",
  "sunset-memory",
  "vintage-paper",
  "wedding-glow",
  "minimal-dark",
  "dream-sky",
] as const;

export const loginSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
});

export const capsuleBlockSchema = z.object({
  id: z.string().optional(),
  type: z.enum(blockTypes),
  title: z.string().optional(),
  content: z.string().optional(),
  mediaUrl: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  sortOrder: z.number().int().default(0),
});

export const createCapsuleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  capsuleType: z.enum(capsuleTypes),
  theme: z.enum(themes).default("cosmic-night"),
  unlockDate: z.coerce.date().refine((date) => date > new Date(), {
    message: "Unlock date must be in the future",
  }),
  coverImageUrl: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  blocks: z.array(capsuleBlockSchema).optional(),
});

export const updateCapsuleSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  capsuleType: z.enum(capsuleTypes).optional(),
  theme: z.enum(themes).optional(),
  unlockDate: z.coerce
    .date()
    .refine((date) => date > new Date(), {
      message: "Unlock date must be in the future",
    })
    .optional(),
  coverImageUrl: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  isLocked: z.boolean().optional(),
  blocks: z.array(capsuleBlockSchema).optional(),
});

export type CreateCapsuleInput = z.infer<typeof createCapsuleSchema>;
export type UpdateCapsuleInput = z.infer<typeof updateCapsuleSchema>;
export type CapsuleBlockInput = z.infer<typeof capsuleBlockSchema>;
