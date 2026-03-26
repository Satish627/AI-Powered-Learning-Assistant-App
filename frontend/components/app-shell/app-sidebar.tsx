import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export function AppSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 rounded-l-[32px] border border-border/70 bg-secondary/70 p-5 md:flex md:min-h-[calc(100vh-2rem)] md:flex-col">
      <div className="rounded-[24px] border border-white/70 bg-background/75 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Learning OS
        </p>
        <h2 className="mt-3 text-2xl font-semibold leading-tight">
          AI-Powered Learning Assistant
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Calm structure for dense reading and the study tools that follow it.
        </p>
      </div>

      <nav className="mt-8 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </Link>
      </nav>

      <div className="mt-auto rounded-[24px] border border-border/60 bg-background/70 p-5">
        <p className="text-sm font-semibold">Phase 1 foundation</p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          The shell is intentionally narrow right now so later document and AI
          features slot into a stable navigation pattern.
        </p>
      </div>
    </aside>
  );
}
