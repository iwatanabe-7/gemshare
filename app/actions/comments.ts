"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addComment(promptId: string, body: string, rating?: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("LOGIN_REQUIRED");
  if (!body.trim()) throw new Error("EMPTY_BODY");

  const { error } = await supabase.from("comments").insert({
    user_id: user.id,
    prompt_id: promptId,
    body: body.trim(),
    rating: rating ?? null,
  });
  if (error) throw error;
  revalidatePath(`/prompts/${promptId}`);
}
