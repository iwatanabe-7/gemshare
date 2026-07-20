import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const PERIODS = [
  { key: "today", label: "今日", view: "ranking_today" },
  { key: "week", label: "今週", view: "ranking_week" },
  { key: "month", label: "今月", view: "ranking_month" },
] as const;

export default async function RankingPage({
  searchParams,
}: { searchParams: Promise<{ period?: string }> }) {
  const { period = "week" } = await searchParams;
  const active = PERIODS.find((p) => p.key === period) ?? PERIODS[1];
  const supabase = await createClient();

  const { data: ranked } = await supabase
    .from(active.view)
    .select("prompt_id, copies_in_period")
    .order("copies_in_period", { ascending: false })
    .limit(10);

  const ids = ranked?.map((r) => r.prompt_id) ?? [];
  let prompts: any[] = [];
  if (ids.length > 0) {
    const { data } = await supabase.from("prompts").select("id, title, category:categories(name)").in("id", ids);
    prompts = ranked!
      .map((r) => ({ ...data?.find((p) => p.id === r.prompt_id), copies_in_period: r.copies_in_period }))
      .filter((p) => p.id);
  }
  const maxCopies = prompts[0]?.copies_in_period || 1;

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-9">
      <p className="mb-2 text-xs font-bold tracking-wider text-[#4C3FE0]">RANKING</p>
      <h1 className="mb-6 text-2xl font-extrabold text-[#170F2E]">人気Gemランキング</h1>

      <div className="mb-7 flex gap-2">
        {PERIODS.map((p) => (
          <Link
            key={p.key}
            href={`/ranking?period=${p.key}`}
            className="rounded-full px-4 py-2 text-[13px] font-bold"
            style={{
              background: p.key === active.key ? "#4C3FE0" : "#F1EEFF",
              color: p.key === active.key ? "#fff" : "#4C3FE0",
            }}
          >
            {p.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col divide-y overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
        {prompts.length > 0 ? prompts.map((p, i) => (
          <Link key={p.id} href={`/prompts/${p.id}`} className="grid grid-cols-[40px_1fr_auto] items-center gap-4 bg-white px-5 py-4">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold"
              style={{ background: i === 0 ? "#F7C948" : "#F1EEFF", color: i === 0 ? "#fff" : "#4C3FE0" }}
            >
              {i + 1}
            </div>
            <div>
              <div className="text-[14.5px] font-bold text-[#170F2E]">{p.title}</div>
              <div className="mt-0.5 text-[11.5px] text-[#8B84A3]">{p.category?.name}</div>
              <div className="mt-2 h-[5px] max-w-[200px] overflow-hidden rounded bg-[#F1EEFF]">
                <div className="h-full bg-[#4C3FE0]" style={{ width: `${(p.copies_in_period / maxCopies) * 100}%` }} />
              </div>
            </div>
            <div className="text-right">
              <div className="text-[15px] font-extrabold text-[#170F2E]">{p.copies_in_period}</div>
              <div className="text-[10px] text-[#8B84A3]">コピー数</div>
            </div>
          </Link>
        )) : (
          <div className="p-12 text-center text-sm text-[#8B84A3]">この期間にコピーされたGemはまだありません。</div>
        )}
      </div>
    </div>
  );
}
