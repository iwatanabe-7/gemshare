import { createClient } from "@/lib/supabase/server";
import { addCategory } from "@/app/actions/admin";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <div className="flex flex-col gap-8">
      <form action={addCategory} className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-[12px] font-bold text-[#5B5470]">
          slug
          <input name="slug" required className="input" placeholder="例：health" />
        </label>
        <label className="flex flex-col gap-1 text-[12px] font-bold text-[#5B5470]">
          表示名
          <input name="name" required className="input" placeholder="例：健康" />
        </label>
        <button className="rounded-lg px-4 py-2.5 text-[12.5px] font-bold text-white" style={{ background: "#4C3FE0" }}>
          追加
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {categories?.map((c) => (
          <span key={c.id} className="rounded-full bg-[#F1EEFF] px-3.5 py-1.5 text-[12.5px] font-bold text-[#4C3FE0]">
            {c.name} ({c.slug})
          </span>
        ))}
      </div>
    </div>
  );
}
