"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Copy, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { registerCopy } from "@/app/actions/copy";

export function CopyButton({
  id, text, copies, isLoggedIn,
}: { id: string; text: string; copies: number; isLoggedIn: boolean }) {
  const [busy, setBusy] = useState(false);
  const pathname = usePathname();

  const goLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(pathname)}` },
    });
  };

  const handleClick = async () => {
    if (!isLoggedIn) return goLogin();
    setBusy(true);
    try {
      await navigator.clipboard.writeText(text);
      await registerCopy(id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className="flex flex-1 items-center justify-center gap-2 rounded-[14px] px-5 py-3.5 text-[14.5px] font-bold text-white disabled:opacity-60"
      style={{ background: isLoggedIn ? "#4C3FE0" : "#8B84A3" }}
    >
      {isLoggedIn ? <Copy size={16} /> : <Lock size={16} />}
      {isLoggedIn ? `プロンプトをコピー（${copies}）` : "ログインしてコピー"}
    </button>
  );
}
