import { createClient } from "@/lib/supabase/server";
import { GemCard } from "@/components/gem-card";

const GEM_SELECT = "*, category:categories(name,slug), tags:prompt_tags(tag:tags(name))";

async function searchPrompts(supabase: any, q: string) {
  // タイトル・説明文の部分一致
  const { data: byText } = await supabase
    .from("prompts")
    .select(GEM_SELECT)
    .eq("status", "published")
    .or(`title.ilike.%${q}%,description.ilike.%${q}%`);

  // タグ名の部分一致（#SEO のようなタグからも探せるように）
  const { data: tagMatches } = await supabase
    .from("tags")
    .select("id, prompt_tags(prompt_id)")
    .ilike("name", `%${q}%`);

  const tagPromptIds = Array.from(
    new Set(
      (tagMatches ?? []).flatMap((t: any) => t.prompt_tags?.map((pt: any) => pt.prompt_id) ?? [])
    )
  );

  let byTag: any[] = [];
  if (tagPromptIds.length > 0) {
    const { data } = await supabase
      .from("prompts")
      .select(GEM_SELECT)
      .eq("status", "published")
      .in("id", tagPromptIds);
    byTag = data ?? [];
  }

  const merged = [...(byText ?? []), ...byTag];
  const unique = Array.from(new Map(merged.map((p) => [p.id, p])).values());
  return unique.sort((a: any, b: any) => b.copies - a.copies);
}

export default async function SearchPage({
  searchParams,
}: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const supabase = await createClient();
  const prompts = q.trim() ? await searchPrompts(supabase, q.trim()) : [];

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-9">
      <p className="mb-2 text-xs font-bold tracking-wider text-[#4C3FE0]">SEARCH</p>
      <h1 className="mb-2 text-2xl font-extrabold text-[#170F2E]">「{q}」の検索結果</h1>
      <p className="mb-8 text-sm text-[#5B5470]">{prompts.length}件見つかりました。</p>

      {prompts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((p: any) => <GemCard key={p.id} gem={p} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-[#8B84A3]" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
          一致するGemが見つかりませんでした。別のキーワードをお試しください。
        </div>
      )}
    </div>
  );
}
