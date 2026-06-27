import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { updateCapsuleSchema } from "@/lib/validators";
import { normalizeMediaUrl } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const capsule = await prisma.capsule.findUnique({
      where: { id },
      include: { blocks: { orderBy: { sortOrder: "asc" } } },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    return NextResponse.json({ capsule });
  } catch (error) {
    console.error("GET capsule error:", error);
    return NextResponse.json({ error: "Failed to fetch capsule" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.capsule.findUnique({ where: { id } });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateCapsuleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { blocks, ...capsuleData } = parsed.data;

    if (blocks) {
      await prisma.capsuleBlock.deleteMany({ where: { capsuleId: id } });
      await prisma.capsuleBlock.createMany({
        data: blocks.map((block, index) => ({
          capsuleId: id,
          type: block.type,
          title: block.title,
          content: block.content,
          mediaUrl: normalizeMediaUrl(block.mediaUrl),
          sortOrder: index,
        })),
      });
    }

    const capsule = await prisma.capsule.update({
      where: { id },
      data: {
        ...capsuleData,
        ...(capsuleData.coverImageUrl !== undefined
          ? { coverImageUrl: normalizeMediaUrl(capsuleData.coverImageUrl) }
          : {}),
      },
      include: { blocks: { orderBy: { sortOrder: "asc" } } },
    });

    if (capsuleData.isLocked) {
      await prisma.accessLog.create({
        data: { capsuleId: id, action: "locked" },
      });
    }

    return NextResponse.json({ capsule });
  } catch (error) {
    console.error("PATCH capsule error:", error);
    return NextResponse.json({ error: "Failed to update capsule" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.capsule.findUnique({ where: { id } });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    }

    await prisma.capsule.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE capsule error:", error);
    return NextResponse.json({ error: "Failed to delete capsule" }, { status: 500 });
  }
}
