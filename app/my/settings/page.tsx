import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateProfileName } from "@/app/actions/profile";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/my");

const { data: profile } = (await supabase.rpc("get_my_profile").single()) as { data: any };

  return (
    <div className="mx-auto max-w-[480px] px-6 py-9">
      <h1 className="mb-1 text-xl font-extrabold text-[#170F2E]">プロフィール設定</h1>
      <p className="mb-7 text-[13px] text-[#8B84A3]">{profile?.email}</p>

      <form action={updateProfileName} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-[12.5px] font-bold text-[#5B5470]">
          表示名
          <input name="name" defaultValue={profile?.name ?? ""} required maxLength={30} className="input" />
        </label>
        <button
          type="submit"
          className="self-start rounded-[12px] px-5 py-2.5 text-[13.5px] font-bold text-white"
          style={{ background: "#4C3FE0" }}
        >
          保存する
        </button>
      </form>
    </div>
  );
}
