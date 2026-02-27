// components/auth/AuthForm.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // ✅ clear guest cart after login (optional)
        localStorage.removeItem("cookie_shop_cart_v2");

        setMessage("Logged in ✅");
        window.location.href = "/";
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        // ✅ clear guest cart after signup (optional)
        localStorage.removeItem("cookie_shop_cart_v2");

        setMessage(
          "Account created ✅ If email confirmation is enabled, check your inbox."
        );
        window.location.href = "/";
      }
    } catch (err: any) {
      setMessage(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <h1 className="text-2xl font-semibold tracking-tight">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "login"
          ? "Login to order and track your cookies."
          : "Sign up to start ordering cookies."}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime-300/40"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lime-300/40"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded-xl bg-lime-300 px-4 py-3 text-sm font-semibold text-black transition hover:bg-lime-200 disabled:opacity-60"
        >
          {loading
            ? "Please wait…"
            : mode === "login"
            ? "Login"
            : "Sign up"}
        </button>

        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}

        <p className="text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <Link className="font-medium text-foreground" href="/signup">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link className="font-medium text-foreground" href="/login">
                Login
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}