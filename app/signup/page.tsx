// app/signup/page.tsx
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Warm bakery background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10
        bg-[radial-gradient(1200px_520px_at_18%_-10%,rgba(255,215,140,0.60),transparent_60%)]
        dark:bg-[radial-gradient(1200px_520px_at_18%_-10%,rgba(255,215,140,0.20),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10
        bg-gradient-to-b from-[#FFF7E6] via-[#FFF1D2] to-[#FFFFFF]
        dark:from-[#0B0B0B] dark:via-[#0B0B0B] dark:to-[#0B0B0B]"
      />

      <div className="mx-auto max-w-screen-2xl px-6 py-28">
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}