import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-shell/app-header";
import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { getCurrentUserServer } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-0 px-4 py-4 md:px-6 md:py-6">
        <AppSidebar />
        <div className="flex min-h-[calc(100vh-2rem)] flex-1 flex-col overflow-hidden rounded-r-[32px] border border-l-0 border-border/70 bg-card shadow-[0_24px_90px_rgba(20,33,61,0.08)]">
          <AppHeader user={user} />
          <main className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
