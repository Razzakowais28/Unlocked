"use client";

import Link from "next/link";

interface PageHeaderProps {
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  backHref = "/dashboard",
  backLabel = "Back to dashboard",
  children,
}: PageHeaderProps) {
  return (
    <header className="header-bar px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {backHref ? (
          <Link href={backHref} className="link-back link-muted">
            {backLabel}
          </Link>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}
