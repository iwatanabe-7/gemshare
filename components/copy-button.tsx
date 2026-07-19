"use client";
import { useState } from "react";
import { registerCopy } from "@/app/actions/copy";
import { createClient } from "@/lib/supabase/client";

export function CopyButton({
  id, text, copies, isLoggedIn, onLoginRequired,
}: { id: string; text: string; copies: number; isLoggedIn: boolean; onLoginRequired: () => void }) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (!isLoggedIn) { onLoginRequired(); return; } // ログインモーダルを開く
    setBusy(true);
    try {
      await navigator.clipboard.writeText(text);
      await registerCopy(id); // カウント + copy_logs 記録（サーバー側でも未ログインは弾かれる）
    } finally {
      setBusy(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={busy}>
      {isLoggedIn ? `プロンプトをコピー（${copies}）` : "ログインしてコピー"}
    </button>
  );
}