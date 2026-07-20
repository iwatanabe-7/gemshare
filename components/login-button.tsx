"use client";
import { createClient } from "@/lib/supabase/client";

export function LoginButton({ next = "/", label = "Googleで始める" }: { next?: string; label?: string }) {
  const supabase = createClient();
  const signIn = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });

  return (
    <button
      onClick={signIn}
      className="rounded-[12px] px-[22px] py-[11px] text-[13.5px] font-bold text-white"
      style={{ background: "#4C3FE0" }}
    >
      {label}
    </button>
  );
}
