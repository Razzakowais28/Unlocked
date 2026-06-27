import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "unlocked-user-id";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;

  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}
