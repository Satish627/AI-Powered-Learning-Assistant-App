import Link from "next/link";
import { ArrowRight, BookOpenText, BrainCircuit, Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

const highlights = [
  {
    icon: BookOpenText,
    title: "Read without friction",
    description:
      "Open dense study material in a calm workspace designed to feel quick, clear, and focused.",
  },
  {
    icon: BrainCircuit,
    title: "Ask better questions",
    description:
      "Move from static PDFs to guided understanding with AI chat, summaries, quizzes, and flashcards.",
  },
  {
    icon: Sparkles,
    title: "Keep the momentum",
    description:
      "Track recent activity and revisit the important concepts that deserve another pass.",
  },
];

export default async function MarketingPage() {
  const cookieStore = await cookies();

  if (cookieStore.get(AUTH_COOKIE_NAME)?.value) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10 md:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col overflow-hidden rounded-[36px] border border-border/70 bg-card shadow-[0_30px_120px_rgba(20,33,61,0.10)]">
        <header className="flex items-center justify-between border-b border-border/70 px-6 py-5 md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              AI-Powered Learning Assistant
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Built for readers who want speed and clarity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/auth">Log in</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/auth">
                Start Studying
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </header>

        <section className="grid flex-1 gap-10 px-6 py-12 md:grid-cols-[1.3fr_0.9fr] md:px-8 md:py-14">
          <div className="flex flex-col justify-between gap-10">
            <div className="space-y-6">
              <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                Academic by default. Fast on purpose.
              </span>
              <div className="max-w-3xl space-y-5">
                <h1 className="font-heading text-5xl font-semibold leading-[1.02] text-balance md:text-7xl">
                  Study tools should feel lighter than the reading they support.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                  Upload your documents, keep your notes in motion, and turn
                  long-form reading into an AI-assisted learning flow that feels
                  responsive instead of cluttered.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-6 text-base">
                  <Link href="/auth">
                    Start Studying
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
                  <Link href="/auth">Create Account</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-border/70 bg-secondary/45 p-5"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-background p-3 text-primary shadow-sm">
                    <item.icon className="size-5" />
                  </div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(180deg,rgba(230,237,245,0.95),rgba(248,246,241,0.98))] p-6 md:p-7">
            <div className="absolute inset-x-10 top-0 h-28 rounded-b-full bg-primary/10 blur-3xl" />
            <div className="relative space-y-5">
              <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_50px_rgba(20,33,61,0.08)]">
                <p className="text-sm font-semibold text-primary">
                  Reading session
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Move from document to understanding.
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Ask follow-up questions, generate summaries, and set yourself
                  up for flashcards and quizzes without leaving the workspace.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[22px] border border-border/70 bg-card p-5">
                  <p className="text-sm font-semibold text-foreground">
                    Phase 1 foundation
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Secure auth, a polished public entry point, and the first
                    dashboard shell are live first so later AI features plug
                    into a stable product frame.
                  </p>
                </div>
                <div className="rounded-[22px] border border-primary/15 bg-primary/10 p-5">
                  <p className="text-sm font-semibold text-primary">
                    Built for public launch
                  </p>
                  <p className="mt-2 text-sm leading-7 text-foreground/80">
                    The goal is a deployable app that looks intentional on day
                    one, not a temporary demo surface.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
