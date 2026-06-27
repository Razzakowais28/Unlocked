interface DashboardPageHeaderProps {
  title: string;
  description?: string;
}

export default function DashboardPageHeader({
  title,
  description,
}: DashboardPageHeaderProps) {
  return (
    <header className="header-bar px-4 py-4 md:px-8 md:py-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
    </header>
  );
}
