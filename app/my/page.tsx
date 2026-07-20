import { createClient } from "@/lib/supabase/server";
import { LoginButton } from "@/components/login-button";
import { LogoutButton } from "@/components/logout-button";
import { GemCard } from "@/components/gem-card";

const GEM_SELECT = `
  *,
  category:categories(name,slug),
  tags:prompt_tags(tag:tags(name))
`;

export default async function MyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-[480px] px-6 py-20 text-center">
        <h1 className="mb-3 text-xl font-extrabold text-[#170F2E]">マイページはログインが必要です</h1>
        <p className="mb-6 text-sm text-[#5B5470]">
          自分の投稿やお気に入りを見るにはGoogleログインしてください。
        </p>
        <div className="flex justify-center">
          <LoginButton next="/my" />
        </div>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, icon_url")
    .eq("id", user.id)
    .single();

  const { data: myPosts } = await supabase
    .from("prompts")
    .select(GEM_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: favoriteRows } = await supabase
    .from("favorites")
    .select(`prompt:prompts(${GEM_SELECT})`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const myFavorites = (favoriteRows ?? [])
    .map((r: any) => r.prompt)
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-9">
      <div className="mb-9 flex items-center gap-3.5">
        <div className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#ECE8FF] text-xl font-extrabold text-[#4C3FE0]">
          {profile?.name?.slice(0, 1) ?? "?"}
        </div>
        <div>
          <div className="text-lg font-extrabold text-[#170F2E]">{profile?.name ?? "ユーザー"}</div>
          <div className="text-[12.5px] text-[#8B84A3]">
            投稿 {myPosts?.length ?? 0}件 ・ お気に入り {myFavorites.length}件
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <a href="/my/settings" className="text-[13px] font-bold text-[#4C3FE0]">
            プロフィール編集
          </a>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-3.5 text-base font-extrabold text-[#170F2E]">あなたの投稿</h2>
        {myPosts && myPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {myPosts.map((p: any, i: number) => <GemCard key={p.id} gem={p} index={i} />)}
          </div>
        ) : (
          <EmptyState text="まだ投稿がありません。最初のGemを投稿してみましょう。" />
        )}
      </section>

      <section>
        <h2 className="mb-3.5 text-base font-extrabold text-[#170F2E]">お気に入り</h2>
        {myFavorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {myFavorites.map((p: any) => <GemCard key={p.id} gem={p} />)}
          </div>
        ) : (
          <EmptyState text="お気に入りしたGemはまだありません。" />
        )}
      </section>

      <div className="mt-14 flex justify-center border-t pt-8" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
        <LogoutButton />
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[rgba(23,15,46,0.10)] p-10 text-center text-sm text-[#8B84A3]">
      {text}
    </div>
  );
}
