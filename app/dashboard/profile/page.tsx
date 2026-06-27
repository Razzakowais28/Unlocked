import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Box, Brain, Mail, Calendar, User } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardPageHeader from "@/components/DashboardPageHeader";
import GlassCard from "@/components/GlassCard";
import LogoutButton from "@/components/LogoutButton";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [capsuleCount, memoryCount] = await Promise.all([
    prisma.capsule.count({ where: { userId: user.id } }),
    prisma.capsuleBlock.count({ where: { capsule: { userId: user.id } } }),
  ]);

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <DashboardPageHeader
          title="Profile"
          description="Your account and capsule activity"
        />

        <div className="p-4 md:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <GlassCard className="p-6 lg:col-span-1">
              <div className="flex flex-col items-center text-center">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-900 text-2xl font-bold text-white">
                    {initials}
                  </div>
                )}
                <h2 className="mt-4 text-xl font-semibold text-foreground">{user.name}</h2>
                <p className="mt-1 text-sm text-muted">{user.email}</p>
              </div>
              <div className="mt-6 flex justify-center">
                <LogoutButton />
              </div>
            </GlassCard>

            <div className="space-y-4 lg:col-span-2">
              <GlassCard className="p-5">
                <h3 className="mb-4 font-semibold text-foreground">Account details</h3>
                <dl className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-[var(--primary)]" />
                    <div>
                      <dt className="text-xs text-muted">Display name</dt>
                      <dd className="text-sm text-foreground">{user.name}</dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[var(--primary)]" />
                    <div>
                      <dt className="text-xs text-muted">Email</dt>
                      <dd className="text-sm text-foreground">{user.email}</dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-[var(--primary)]" />
                    <div>
                      <dt className="text-xs text-muted">Member since</dt>
                      <dd className="text-sm text-foreground">
                        {format(user.createdAt, "MMMM d, yyyy")}
                      </dd>
                    </div>
                  </div>
                </dl>
              </GlassCard>

              <div className="grid gap-4 sm:grid-cols-2">
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between">
                    <Box className="h-5 w-5 text-[var(--primary)]" />
                    <span className="text-2xl font-bold">{capsuleCount}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">Capsules created</p>
                </GlassCard>
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between">
                    <Brain className="h-5 w-5 text-[var(--primary)]" />
                    <span className="text-2xl font-bold">{memoryCount}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">Memories stored</p>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
