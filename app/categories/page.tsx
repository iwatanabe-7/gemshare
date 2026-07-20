import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, slug, name").order("sort_order");
  const { data: counts } = await supabase.from("prompts").select("category_id").eq("status", "published");

  const countMap: Record<string, number> = {};
  counts?.forEach((c) => { countMap[c.category_id] = (countMap[c.category_id] ?? 0) + 1; });

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-9">
      <p className="mb-2 text-xs font-bold tracking-wider text-[#4C3FE0]">CATEGORIES</p>
      <h1 className="mb-8 text-2xl font-extrabold text-[#170F2E]">カテゴリから探す</h1>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
        {categories?.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="rounded-2xl border p-5 text-center text-[13.5px] font-bold"
            style={{ borderColor: "rgba(23,15,46,0.10)" }}
          >
            {c.name}
            <div className="mt-1.5 text-[11px] font-medium text-[#8B84A3]">{countMap[c.id] ?? 0}件</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
