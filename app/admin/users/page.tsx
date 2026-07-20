import { createClient } from "@/lib/supabase/server";
import { toggleBanUser } from "@/app/actions/admin";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase.rpc("admin_list_profiles");

  return (
    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
      <table className="w-full text-left text-[13px]">
        <thead className="bg-[#F1EEFF] text-[11.5px] text-[#5B5470]">
          <tr>
            <th className="px-4 py-3">名前</th>
            <th className="px-4 py-3">メール</th>
            <th className="px-4 py-3">状態</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u: any) => (
            <tr key={u.id} className="border-t" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
              <td className="px-4 py-3 font-semibold">
                {u.name}{u.is_admin && <span className="ml-1.5 text-[10px] text-[#4C3FE0]">(admin)</span>}
              </td>
              <td className="px-4 py-3 text-[#5B5470]">{u.email}</td>
              <td className="px-4 py-3">
                {u.is_banned ? <span className="font-bold text-[#E0554F]">停止中</span> : <span className="text-[#5B5470]">通常</span>}
              </td>
              <td className="px-4 py-3">
                <form action={toggleBanUser.bind(null, u.id, !u.is_banned)}>
                  <button className="rounded-lg border px-3 py-1.5 text-[12px] font-bold" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
                    {u.is_banned ? "停止解除" : "停止する"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
