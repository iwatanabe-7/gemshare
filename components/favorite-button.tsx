"use client";
import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toggleFavorite } from "@/app/actions/favorites";

export function FavoriteButton({
  id, likesCount, isFavorited, isLoggedIn,
}: { id: string; likesCount: number; isFavorited: boolean; isLoggedIn: boolean }) {
  const [pending, startTransition] = useTransition();
  const pathname = usePathname();

  const goLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(pathname)}` },
    });
  };

  const handleClick = () => {
    if (!isLoggedIn) return goLogin();
    startTransition(() => toggleFavorite(id));
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-2 rounded-[14px] border px-5 py-3.5 text-[14.5px] font-bold disabled:opacity-60"
      style={{
        background: isFavorited ? "#4C3FE0" : "#fff",
        color: isFavorited ? "#fff" : "#170F2E",
        borderColor: "rgba(23,15,46,0.10)",
      }}
    >
      <Heart size={16} fill={isFavorited ? "#fff" : "none"} /> {likesCount}
    </button>
  );
}
