import Link from "next/link";
import { Logo } from "./logo";
import { LoginButton } from "./login-button";
import { LogoutButton } from "./logout-button";
import { SearchBar } from "./search-bar";
import { createClient } from "@/lib/supabase/server";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9FF]" style={{ borderBottom: "2px solid #170F2E" }}>
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4 px-6 py-3">
        <Link href="/">
          <Logo size={30} />
        </Link>

        <nav className="hidden gap-5 text-sm font-bold text-[#170F2E] md:flex">
          <Link href="/categories">カテゴリ</Link>
          <Link href="/ranking">ランキング</Link>
          <Link href="/prompts/new">投稿する</Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <SearchBar />
          {user ? (
            <div className="hidden items-center gap-4 text-sm font-bold text-[#4C3FE0] md:flex">
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
