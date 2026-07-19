"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPrompt(form: {
  title: string; description: string; categoryId: string;
  promptBody: string; usage: string; tags: string[]; geminiUrl?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { data: prompt, error } = await supabase.from("prompts").insert({
    user_id: user.id,
    category_id: form.categoryId,
    title: form.title,
    description: form.description,
    prompt_body: form.promptBody,
    usage_example: form.usage,
    gemini_url: form.geminiUrl || null, // GeminiのGem共有URL（任意）
  }).select().single();
  if (error) throw error;

  for (const name of form.tags) {
    const { data: tag } = await supabase
      .from("tags").upsert({ name }, { onConflict: "name" }).select().single();
    if (tag) await supabase.from("prompt_tags").insert({ prompt_id: prompt.id, tag_id: tag.id });
  }
  revalidatePath("/");
  return prompt;
}