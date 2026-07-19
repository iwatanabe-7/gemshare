"use client";
import { createClient } from "@/lib/supabase/client";

export function LoginButton() {
  const supabase = createClient();
  const signIn = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  return <button onClick={signIn}>Googleで始める</button>;
}