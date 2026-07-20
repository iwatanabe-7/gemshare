import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-9">
      <h1 className="mb-6 text-2xl font-extrabold text-[#170F2E]">管理画面</h1>
      <nav className="mb-8 flex gap-5 border-b pb-3 text-[13.5px] font-bold text-[#5B5470]" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
        <Link href="/admin/reports">通報確認</Link>
        <Link href="/admin/users">ユーザー管理</Link>
        <Link href="/admin/categories">カテゴリ管理</Link>
      </nav>
      {children}
    </div>
  );
}
