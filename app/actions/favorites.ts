"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(promptId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("LOGIN_REQUIRED");

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("prompt_id", promptId)
    .maybeSingle();

  if (existing) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", existing.id);

  if (error) throw error;
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        prompt_id: promptId,
      });

    if (error) throw error;
  }
  revalidatePath(`/prompts/${promptId}`);
  revalidatePath("/");
  revalidatePath("/ranking");
  revalidatePath("/search");
}
