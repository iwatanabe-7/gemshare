"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfileName(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("LOGIN_REQUIRED");

  const name = String(formData.get("name") || "").trim();
  if (!name || name.length > 30) {
    throw new Error("表示名は1〜30文字で入力してください");
  }

  const { error } = await supabase.from("profiles").update({ name }).eq("id", user.id);
  if (error) throw error;

  revalidatePath("/my");
  revalidatePath("/");

  redirect("/my");
}
