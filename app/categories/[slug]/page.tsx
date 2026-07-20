import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GemCard } from "@/components/gem-card";
import { ArrowLeft } from "lucide-react";

export default async function CategoryPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase.from("categories").select("id, name").eq("slug", slug).single();
  if (!category) notFound();

  const { data: prompts } = await supabase
    .from("prompts")
    .select("*, category:categories(name,slug), tags:prompt_tags(tag:tags(name))")
    .eq("status", "published")
    .eq("category_id", category.id)
    .order("copies", { ascending: false });

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-9">
      <Link href="/categories" className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#4C3FE0]">
        <ArrowLeft size={14} /> カテゴリ一覧
      </Link>
      <p className="mb-2 text-xs font-bold tracking-wider text-[#4C3FE0]">CATEGORY</p>
      <h1 className="mb-2 text-2xl font-extrabold text-[#170F2E]">{category.name}</h1>
      <p className="mb-8 text-sm text-[#5B5470]">{prompts?.length ?? 0}件のGemが見つかりました。</p>

      {prompts && prompts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((p) => <GemCard key={p.id} gem={p} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-[#8B84A3]" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
          このカテゴリにはまだGemがありません。
        </div>
      )}
    </div>
  );
}
