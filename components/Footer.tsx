import Link from "next/link";
import { Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-subtle bg-footer">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-bright)]">
                <Lock className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">unlocked</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted">
              A message meant for the future. Preserve today for the person you&apos;ll become tomorrow.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/#features" className="link-muted hover:text-foreground">Features</Link></li>
              <li><Link href="/pricing" className="link-muted hover:text-foreground">Pricing</Link></li>
              <li><Link href="/login" className="link-muted hover:text-foreground">Sign up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><span className="cursor-default">Privacy</span></li>
              <li><span className="cursor-default">Terms</span></li>
              <li><span className="cursor-default">Security</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-subtle pt-8 text-center text-sm text-muted">
          <p>© {new Date().getFullYear()} Unlocked. Private by design. Production encryption can be added later.</p>
        </div>
      </div>
    </footer>
  );
}
