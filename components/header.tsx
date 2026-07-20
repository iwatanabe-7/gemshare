import Link from "next/link";
import { LoginButton } from "./login-button";
import { LogoutButton } from "./logout-button";
import { SearchBar } from "./search-bar";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(23,15,46,0.10)] bg-[rgba(250,249,255,0.92)] backdrop-blur">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 px-6 py-3.5">
        <Link href="/" className="text-lg font-extrabold text-[#170F2E]">
          GemShare
        </Link>
        <nav className="flex gap-5 text-sm font-semibold text-[#5B5470]">
          <Link href="/categories">カテゴリ</Link>
          <Link href="/ranking">ランキング</Link>
          <Link href="/prompts/new">投稿する</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <SearchBar />
          {user ? (
            <div className="flex items-center gap-4 text-sm font-bold text-[#4C3FE0]">
              <Link href="/my/notifications">通知</Link>
              <Link href="/my">マイページ</Link>
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
