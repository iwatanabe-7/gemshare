"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("LOGIN_REQUIRED");
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) throw new Error("NOT_ADMIN");
  return supabase;
}

export async function resolveReport(reportId: string, status: "resolved" | "dismissed") {
  const supabase = await requireAdmin();
  await supabase.from("reports").update({ status }).eq("id", reportId);
  revalidatePath("/admin/reports");
}

export async function hidePrompt(promptId: string) {
  const supabase = await requireAdmin();
  await supabase.from("prompts").update({ status: "hidden" }).eq("id", promptId);
  revalidatePath("/admin/reports");
}

export async function toggleBanUser(userId: string, banned: boolean) {
  const supabase = await requireAdmin();
  await supabase.from("profiles").update({ is_banned: banned }).eq("id", userId);
  revalidatePath("/admin/users");
}

export async function addCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const slug = String(formData.get("slug") || "").trim();
  const name = String(formData.get("name") || "").trim();
  if (!slug || !name) throw new Error("入力してください");
  await supabase.from("categories").insert({ slug, name, sort_order: 99 });
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}
