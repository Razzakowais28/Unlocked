import { redirect } from "next/navigation";
import Link from "next/link";
import {
  User,
  Users,
  Heart,
  Smile,
  Briefcase,
  GraduationCap,
  Cake,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { CAPSULE_TYPES, THEMES } from "@/lib/utils";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardPageHeader from "@/components/DashboardPageHeader";
import GlassCard from "@/components/GlassCard";
import { cn } from "@/lib/utils";

const iconMap = {
  User,
  Users,
  Heart,
  Smile,
  Briefcase,
  GraduationCap,
  Cake,
  Sparkles,
} as const;

const templateThemes: Record<string, string> = {
  personal: "minimal-dark",
  family: "sunset-memory",
  couple: "wedding-glow",
  friends: "dream-sky",
  business: "minimal-dark",
  graduation: "cosmic-night",
  birthday: "wedding-glow",
  other: "vintage-paper",
};

export default async function TemplatesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 pb-20 md:pb-0">
        <DashboardPageHeader
          title="Templates"
          description="Start fast with a pre-built capsule structure"
        />

        <div className="p-4 md:p-8">
          <p className="mb-6 text-sm text-muted">
            Pick a template to pre-fill your capsule type and theme. You can customize
            everything before locking it away.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {CAPSULE_TYPES.map((type) => {
              const Icon = iconMap[type.icon as keyof typeof iconMap] ?? Sparkles;
              const theme = templateThemes[type.value] ?? THEMES[0].value;
              const gradient =
                THEMES.find((t) => t.value === theme)?.gradient ?? THEMES[0].gradient;

              return (
                <Link
                  key={type.value}
                  href={`/capsules/new?type=${type.value}&theme=${theme}`}
                >
                  <GlassCard hover className="flex h-full flex-col overflow-hidden">
                    <div
                      className={cn(
                        "flex h-24 items-center justify-center bg-gradient-to-br",
                        gradient
                      )}
                    >
                      <Icon className="h-10 w-10 text-white/90" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-semibold text-foreground">{type.label}</h3>
                      <p className="mt-1 flex-1 text-sm text-muted">{type.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)]">
                        Use template
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
