import { createClient } from "@/lib/supabase/server";
import { resolveReport, hidePrompt } from "@/app/actions/admin";

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("reports")
    .select("*, prompt:prompts(id, title), reporter:profiles!reports_reporter_id_fkey(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-3">
      {reports?.map((r) => (
        <div key={r.id} className="rounded-xl border p-4" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
          <div className="mb-1 text-[13.5px] font-bold text-[#170F2E]">対象: {r.prompt?.title ?? "(削除済み)"}</div>
          <div className="mb-1 text-[12.5px] text-[#5B5470]">理由: {r.reason}</div>
          <div className="mb-3 text-[11.5px] text-[#8B84A3]">
            通報者: {r.reporter?.name ?? "不明"} ・ {new Date(r.created_at).toLocaleString("ja-JP")}
          </div>
          <div className="flex gap-2">
            <form action={hidePrompt.bind(null, r.prompt_id)}>
              <button className="rounded-lg px-3.5 py-2 text-[12.5px] font-bold text-white" style={{ background: "#E0554F" }}>
                投稿を非表示にする
              </button>
            </form>
            <form action={resolveReport.bind(null, r.id, "resolved")}>
              <button className="rounded-lg border px-3.5 py-2 text-[12.5px] font-bold" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
                対応済みにする
              </button>
            </form>
            <form action={resolveReport.bind(null, r.id, "dismissed")}>
              <button className="rounded-lg border px-3.5 py-2 text-[12.5px] font-bold text-[#8B84A3]" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
                却下する
              </button>
            </form>
          </div>
        </div>
      ))}
      {(!reports || reports.length === 0) && (
        <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-[#8B84A3]" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
          未対応の通報はありません。
        </div>
      )}
    </div>
  );
}
