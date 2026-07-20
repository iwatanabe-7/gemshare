import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LoginButton } from "@/components/login-button";
import { markAllRead } from "@/app/actions/notifications";
import { Heart, MessageCircle, TrendingUp, UserPlus } from "lucide-react";

const ICONS: Record<string, any> = { favorited: Heart, commented: MessageCircle, ranked_in: TrendingUp, followed: UserPlus };
const LABELS: Record<string, string> = {
  favorited: "あなたのGemがお気に入りされました",
  commented: "あなたのGemにコメントが届きました",
  ranked_in: "あなたのGemがランキング入りしました",
  followed: "フォローされました",
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-[480px] px-6 py-20 text-center">
        <h1 className="mb-3 text-xl font-extrabold text-[#170F2E]">通知はログインが必要です</h1>
        <div className="flex justify-center"><LoginButton next="/my/notifications" /></div>
      </div>
    );
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  await markAllRead();

  return (
    <div className="mx-auto max-w-[680px] px-6 py-9">
      <h1 className="mb-8 text-2xl font-extrabold text-[#170F2E]">通知</h1>
      <div className="flex flex-col gap-2.5">
        {notifications?.map((n) => {
          const Icon = ICONS[n.type] ?? Heart;
          return (
            <Link
              key={n.id}
              href={n.payload?.prompt_id ? `/prompts/${n.payload.prompt_id}` : "/my"}
              className="flex items-center gap-3.5 rounded-xl border p-4"
              style={{ borderColor: "rgba(23,15,46,0.10)", background: n.is_read ? "#fff" : "#F1EEFF" }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ECE8FF] text-[#4C3FE0]">
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <div className="text-[13.5px] font-semibold text-[#170F2E]">{LABELS[n.type] ?? "通知"}</div>
                <div className="text-[11.5px] text-[#8B84A3]">{new Date(n.created_at).toLocaleString("ja-JP")}</div>
              </div>
            </Link>
          );
        })}
        {(!notifications || notifications.length === 0) && (
          <div className="rounded-2xl border border-dashed p-12 text-center text-sm text-[#8B84A3]" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
            通知はまだありません。
          </div>
        )}
      </div>
    </div>
  );
}
