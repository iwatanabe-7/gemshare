import { createClient } from "@/lib/supabase/server";
import { GemCard } from "@/components/gem-card";

export default async function HomePage({
  searchParams,
}: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = "popular" } = await searchParams;
  const supabase = await createClient();

  const { data: prompts } = await supabase
    .from("prompts")
    .select("*, category:categories(name,slug), tags:prompt_tags(tag:tags(name))")
    .eq("status", "published")
    .order(tab === "new" ? "created_at" : "copies", { ascending: false })
    .limit(24);

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-9">
      <div
        className="mb-9 rounded-[26px] p-9"
        style={{
          background: "linear-gradient(120deg,#7A6BFF,#5FF5DC 120%)",
          border: "2px solid #170F2E",
        }}
      >
        <h1 className="mb-2 text-2xl font-black text-[#170F2E]">
          {tab === "new" ? "新着Gem" : "使えるGemを、みんなの手に。"}
        </h1>
        <p className="max-w-[420px] text-[13.5px] text-[#241a4a]">
          見つけて、シェアして、コピーするだけ。
        </p>
      </div>

      {prompts && prompts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((p) => <GemCard key={p.id} gem={p} />)}
        </div>
      ) : (
        <div className="hard-card rounded-[22px] bg-white p-12 text-center text-sm text-[#8B84A3]">
          まだGemの投稿がありません。最初の投稿者になりましょう。
        </div>
      )}
    </div>
  );
}
