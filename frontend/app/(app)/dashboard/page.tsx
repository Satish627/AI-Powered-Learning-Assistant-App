import { ArrowUpRight, BookMarked, LayoutDashboard, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Workspace status",
    value: "Ready",
    detail: "Authentication and dashboard foundation are in place.",
    icon: LayoutDashboard,
  },
  {
    label: "Documents tracked",
    value: "0",
    detail: "Upload support lands in the next phase.",
    icon: BookMarked,
  },
  {
    label: "AI study tools",
    value: "Queued",
    detail: "Chat, summaries, flashcards, and quizzes build on this shell.",
    icon: Sparkles,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-[linear-gradient(135deg,rgba(230,237,245,0.95),rgba(248,246,241,1))] p-6 md:p-8">
        <span className="inline-flex w-fit rounded-full bg-card/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
          Dashboard workspace
        </span>
        <div className="max-w-3xl space-y-3">
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
            Your study workspace is ready.
          </h1>
          <p className="text-base leading-8 text-muted-foreground md:text-lg">
            This is the home base for your documents, AI study tools, and
            learning progress. Phase 1 keeps it intentionally lean so the
            product structure is stable before the heavier features land.
          </p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {stats.map((item) => (
          <article
            key={item.label}
            className="rounded-[24px] border border-border/70 bg-secondary/45 p-5"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-background p-3 text-primary">
              <item.icon className="size-5" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 text-3xl font-semibold">{item.value}</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {item.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-dashed border-primary/30 bg-card p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Empty state
            </p>
            <h2 className="font-heading text-3xl font-semibold">No documents yet</h2>
            <p className="text-base leading-8 text-muted-foreground">
              Upload your first PDF to start studying.
            </p>
          </div>
          <Button size="lg" className="h-12 px-6 text-base" disabled>
            Upload Coming Next
            <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
