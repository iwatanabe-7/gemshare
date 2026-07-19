import { createClient } from "@/lib/supabase/server";

export async function searchPrompts(q: string) {
  const supabase = await createClient();
  return supabase.from("prompts")
    .select("*, category:categories(name)")
    .eq("status", "published")
    .textSearch("search_vector", q, { type: "websearch", config: "simple" })
    .limit(30);
}

export async function getRanking(period: "today" | "week" | "month") {
  const supabase = await createClient();
  const view = `ranking_${period}` as const;
  const { data: ranked } = await supabase.from(view).select("prompt_id, copies_in_period").limit(10);
  if (!ranked?.length) return [];
  const ids = ranked.map((r) => r.prompt_id);
  const { data: prompts } = await supabase.from("prompts").select("*").in("id", ids);
  return ranked.map((r) => ({
    ...prompts?.find((p) => p.id === r.prompt_id),
    copies_in_period: r.copies_in_period,
  }));
}