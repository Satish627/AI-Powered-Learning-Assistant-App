"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { login, signup } from "@/lib/auth";

import { Button } from "../ui/button";

type AuthMode = "signup" | "login";

const DEFAULT_ERROR_MESSAGE =
  "We couldn't sign you in. Check your email and password, then try again.";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage("");

    try {
      if (mode === "signup") {
        await signup({ name, email, password });
      } else {
        await login({ email, password });
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage(DEFAULT_ERROR_MESSAGE);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[32px] border border-border/70 bg-background p-6 shadow-[0_20px_60px_rgba(20,33,61,0.08)] md:p-8">
      <div className="space-y-4">
        <div className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          {mode === "signup" ? "Create your workspace" : "Welcome back"}
        </div>
        <div>
          <h2 className="font-heading text-3xl font-semibold">
            {mode === "signup" ? "Start studying sooner." : "Log in to continue."}
          </h2>
          <p className="mt-3 text-base leading-8 text-muted-foreground">
            Use one shared auth flow for account creation and sign in, then move
            straight into your dashboard.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 rounded-2xl bg-secondary p-1">
        <button
          type="button"
          className={`rounded-[14px] px-4 py-3 text-sm font-semibold transition ${
            mode === "signup"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
        <button
          type="button"
          className={`rounded-[14px] px-4 py-3 text-sm font-semibold transition ${
            mode === "login"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
          onClick={() => setMode("login")}
        >
          Log in
        </button>
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <label className="block space-y-2">
            <span className="text-sm font-semibold">Name</span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 w-full rounded-2xl border border-input bg-card px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              placeholder="Ada Lovelace"
              required
            />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-semibold">Email</span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-2xl border border-input bg-card px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            placeholder="reader@example.com"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold">Password</span>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full rounded-2xl border border-input bg-card px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
            placeholder="At least 8 characters"
            required
            minLength={8}
          />
        </label>

        {errorMessage ? (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {errorMessage}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={isPending}>
          {isPending ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {mode === "signup" ? "Create Account" : "Log In"}
        </Button>
      </form>

      <p className="mt-6 text-sm leading-7 text-muted-foreground">
        {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
        <button
          type="button"
          className="font-semibold text-primary underline-offset-4 hover:underline"
          onClick={() => setMode((current) => (current === "signup" ? "login" : "signup"))}
        >
          {mode === "signup" ? "Log in" : "Sign up"}
        </button>
      </p>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        Prefer the public overview first?{" "}
        <Link href="/" className="font-semibold text-primary underline-offset-4 hover:underline">
          Go back home
        </Link>
      </p>
    </div>
  );
}
