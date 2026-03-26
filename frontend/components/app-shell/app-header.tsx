"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

import { logout, type AuthUser } from "@/lib/auth";

import { Button } from "../ui/button";

export function AppHeader({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);

    try {
      await logout();
      router.push("/");
      router.refresh();
    } finally {
      setIsPending(false);
      setIsOpen(false);
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-border/70 px-5 py-4 md:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          AI-Powered Learning Assistant
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Dashboard workspace
        </p>
      </div>

      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-2xl px-4"
          onClick={() => setIsOpen((current) => !current)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-label="Open user menu"
        >
          <Menu className="size-4" />
          <span className="max-w-36 truncate">{user.name}</span>
        </Button>

        {isOpen ? (
          <div className="absolute right-0 z-20 mt-3 w-72 rounded-[24px] border border-border/70 bg-popover p-4 shadow-[0_20px_60px_rgba(20,33,61,0.12)]">
            <div className="border-b border-border/60 pb-3">
              <p className="font-semibold">{user.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Log out
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground/80">
                End this session on this device?
              </p>
            </div>
            <Button
              type="button"
              variant="destructive"
              className="mt-4 h-11 w-full rounded-2xl"
              onClick={handleLogout}
              disabled={isPending}
            >
              <LogOut className="size-4" />
              {isPending ? "Logging out..." : "Log out"}
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
