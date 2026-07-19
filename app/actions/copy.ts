"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function registerCopy(promptId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("LOGIN_REQUIRED");

  await supabase.rpc("register_copy", { p_prompt_id: promptId });
  revalidatePath(`/prompts/${promptId}`);
}