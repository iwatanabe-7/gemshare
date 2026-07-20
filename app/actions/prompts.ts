"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TITLE_MIN_LENGTH, TITLE_MAX_LENGTH } from "@/lib/constants";

export async function createPrompt(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("LOGIN_REQUIRED");

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const categoryId = String(formData.get("categoryId") || "");
  const promptBody = String(formData.get("promptBody") || "").trim();
  const usage = String(formData.get("usage") || "").trim();
  const geminiUrl = String(formData.get("geminiUrl") || "").trim();
  const tagsRaw = String(formData.get("tags") || "");

  if (!title || !promptBody || !categoryId) {
    throw new Error("タイトル・カテゴリ・プロンプトは必須です");
  }
  if (title.length < TITLE_MIN_LENGTH || title.length > TITLE_MAX_LENGTH) {
    throw new Error(`タイトルは${TITLE_MIN_LENGTH}〜${TITLE_MAX_LENGTH}文字で入力してください`);
  }

  const { data: prompt, error } = await supabase
    .from("prompts")
    .insert({
      user_id: user.id,
      category_id: categoryId,
      title,
      description,
      prompt_body: promptBody,
      usage_example: usage,
      gemini_url: geminiUrl || null,
    })
    .select()
    .single();

  if (error) throw error;

  const tagNames = tagsRaw
    .split(/[,、\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);

  for (const name of tagNames) {
    const tagId = await ensureTag(supabase, name);
    const { error: linkError } = await supabase
      .from("prompt_tags")
      .insert({ prompt_id: prompt.id, tag_id: tagId });
    if (linkError) throw linkError;
  }

  revalidatePath("/");
  redirect(`/prompts/${prompt.id}`);
}

export async function updatePrompt(promptId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("LOGIN_REQUIRED");

  // 所有者 or 管理者のみ編集可能（DB側のRLSでも二重にチェックされる）
  const { data: existing } = await supabase
    .from("prompts")
    .select("user_id")
    .eq("id", promptId)
    .single();
  if (!existing) throw new Error("NOT_FOUND");

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (existing.user_id !== user.id && !profile?.is_admin) throw new Error("FORBIDDEN");

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const categoryId = String(formData.get("categoryId") || "");
  const promptBody = String(formData.get("promptBody") || "").trim();
  const usage = String(formData.get("usage") || "").trim();
  const geminiUrl = String(formData.get("geminiUrl") || "").trim();
  const tagsRaw = String(formData.get("tags") || "");

  if (!title || !promptBody || !categoryId) {
    throw new Error("タイトル・カテゴリ・プロンプトは必須です");
  }
  if (title.length < TITLE_MIN_LENGTH || title.length > TITLE_MAX_LENGTH) {
    throw new Error(`タイトルは${TITLE_MIN_LENGTH}〜${TITLE_MAX_LENGTH}文字で入力してください`);
  }

  const { error } = await supabase
    .from("prompts")
    .update({
      title,
      description,
      category_id: categoryId,
      prompt_body: promptBody,
      usage_example: usage,
      gemini_url: geminiUrl || null,
    })
    .eq("id", promptId);
  if (error) throw error;

  // タグは一旦全部外して、入力し直された内容で付け直す
  const { error: delError } = await supabase
    .from("prompt_tags")
    .delete()
    .eq("prompt_id", promptId);
  if (delError) throw delError;

  const tagNames = tagsRaw
    .split(/[,、\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);

  for (const name of tagNames) {
    const tagId = await ensureTag(supabase, name);
    const { error: linkError } = await supabase
      .from("prompt_tags")
      .insert({ prompt_id: promptId, tag_id: tagId });
    if (linkError) throw linkError;
  }

  revalidatePath("/");
  // 'layout' 指定で [id] セグメント配下（詳細ページと /edit）をまとめて無効化する。
  // これを詳細ページだけにすると、編集画面に戻ったときフォームが古いタグのままになる。
  revalidatePath("/prompts/[id]", "layout");
  redirect(`/prompts/${promptId}`);
}

// tags は全ユーザー共有のマスタ。既存タグ名を upsert すると ON CONFLICT DO UPDATE で
// 他人が作った行を UPDATE しようとして RLS(42501) に弾かれる。
// そのため「無ければ作る（DO NOTHING）→ 名前で id を引く」だけにして UPDATE 経路を踏まない。
async function ensureTag(
  supabase: Awaited<ReturnType<typeof createClient>>,
  name: string,
): Promise<string> {
  const { error: insertError } = await supabase
    .from("tags")
    .upsert({ name }, { onConflict: "name", ignoreDuplicates: true });
  if (insertError) throw insertError;

  const { data: tag, error: selectError } = await supabase
    .from("tags")
    .select("id")
    .eq("name", name)
    .single();
  if (selectError) throw selectError;
  return tag.id;
}
