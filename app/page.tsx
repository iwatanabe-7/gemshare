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
      <h1 className="mb-6 text-2xl font-extrabold text-[#170F2E]">
        {tab === "new" ? "新着Gem" : "人気Gem"}
      </h1>

      {prompts && prompts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((p) => (
            <GemCard key={p.id} gem={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[rgba(23,15,46,0.10)] p-12 text-center text-sm text-[#8B84A3]">
          まだGemの投稿がありません。最初の投稿者になりましょう。
        </div>
      )}
    </div>
  );
}
