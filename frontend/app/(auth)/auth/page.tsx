import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export default async function AuthPage() {
  const cookieStore = await cookies();

  if (cookieStore.get(AUTH_COOKIE_NAME)?.value) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground md:px-10 md:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-[36px] border border-border/70 bg-card shadow-[0_30px_120px_rgba(20,33,61,0.08)]">
        <section className="hidden flex-1 flex-col justify-between bg-[radial-gradient(circle_at_top,#d8ece8_0%,#eef3f7_46%,#f8f6f1_100%)] p-10 lg:flex">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Secure entry
            </p>
            <h1 className="font-heading text-5xl font-semibold leading-[1.05]">
              Keep your reading flow moving.
            </h1>
            <p className="max-w-md text-base leading-8 text-muted-foreground">
              Sign up once, return whenever you want, and step straight back
              into the dashboard workspace built for your documents.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-[0_18px_50px_rgba(20,33,61,0.07)]">
            <p className="text-sm font-semibold text-primary">What’s ready now</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-foreground/80">
              <li>Cookie-based JWT authentication with current-device logout</li>
              <li>Single sign up and log in flow</li>
              <li>Protected dashboard shell with a clean starting workspace</li>
            </ul>
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center px-6 py-10 md:px-10">
          <AuthForm />
        </section>
      </div>
    </main>
  );
}
