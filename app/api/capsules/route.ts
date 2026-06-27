import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createCapsuleSchema } from "@/lib/validators";
import { normalizeMediaUrl } from "@/lib/utils";
import { nanoid } from "nanoid";

function withCoverPhotoBlock(
  coverImageUrl: string | undefined,
  blocks: Array<{
    type: string;
    title?: string;
    content?: string;
    mediaUrl?: string;
    sortOrder?: number;
  }> = []
) {
  const coverUrl = normalizeMediaUrl(coverImageUrl);
  if (!coverUrl) return blocks;

  const alreadyIncluded = blocks.some(
    (block) => block.type === "photo" && normalizeMediaUrl(block.mediaUrl) === coverUrl
  );
  if (alreadyIncluded) return blocks;

  return [
    { type: "photo", title: "Cover photo", mediaUrl: coverUrl, sortOrder: 0 },
    ...blocks.map((block, index) => ({ ...block, sortOrder: index + 1 })),
  ];
}

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    if (slug) {
      const capsule = await prisma.capsule.findUnique({
        where: { shareSlug: slug },
        include: {
          blocks: { orderBy: { sortOrder: "asc" } },
          user: { select: { name: true } },
        },
      });

      if (!capsule) {
        return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
      }

      return NextResponse.json({ capsule });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const capsules = await prisma.capsule.findMany({
      where: { userId: user.id },
      include: { blocks: { orderBy: { sortOrder: "asc" } } },
      orderBy: { unlockDate: "asc" },
    });

    return NextResponse.json({ capsules });
  } catch (error) {
    console.error("GET capsules error:", error);
    return NextResponse.json({ error: "Failed to fetch capsules" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createCapsuleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { blocks, ...capsuleData } = parsed.data;
    const shareSlug = nanoid(10);
    const blocksToCreate = withCoverPhotoBlock(capsuleData.coverImageUrl, blocks);

    const capsule = await prisma.capsule.create({
      data: {
        ...capsuleData,
        coverImageUrl: normalizeMediaUrl(capsuleData.coverImageUrl),
        userId: user.id,
        shareSlug,
        isLocked: false,
        blocks: blocksToCreate.length
          ? {
              create: blocksToCreate.map((block, index) => ({
                type: block.type,
                title: block.title,
                content: block.content,
                mediaUrl: normalizeMediaUrl(block.mediaUrl),
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: { blocks: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json({ capsule }, { status: 201 });
  } catch (error) {
    console.error("POST capsule error:", error);
    return NextResponse.json({ error: "Failed to create capsule" }, { status: 500 });
  }
}
