import Link from "next/link";
import GlowButton from "@/components/GlowButton";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold gradient-text">404</h1>
      <p className="mt-4 text-xl text-muted">This page doesn&apos;t exist yet.</p>
      <p className="mt-2 text-sm text-muted">
        Maybe it&apos;s locked in a time capsule somewhere.
      </p>
      <div className="mt-8">
        <GlowButton href="/">Go home</GlowButton>
      </div>
    </main>
  );
}
