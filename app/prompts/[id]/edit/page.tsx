import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePrompt } from "@/app/actions/prompts";
import { TITLE_MIN_LENGTH, TITLE_MAX_LENGTH } from "@/lib/constants";

export default async function EditPromptPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/prompts/${id}`);

  const { data: prompt } = await supabase
    .from("prompts")
    .select("*, tags:prompt_tags(tag:tags(name))")
    .eq("id", id)
    .single();
  if (!prompt) notFound();

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  const canEdit = prompt.user_id === user.id || profile?.is_admin;
  if (!canEdit) redirect(`/prompts/${id}`);

  const { data: categories } = await supabase.from("categories").select("id, name").order("sort_order");
  const currentTags = (prompt.tags ?? []).map((t: any) => t.tag?.name).filter(Boolean).join(", ");

  const updatePromptWithId = updatePrompt.bind(null, id);

  return (
    <div className="mx-auto max-w-[620px] px-6 py-9">
      <p className="mb-2 text-xs font-bold tracking-wider text-[#4C3FE0]">EDIT GEM</p>
      <h1 className="mb-2 text-2xl font-extrabold text-[#170F2E]">Gemを編集する</h1>
      <p className="mb-8 text-sm text-[#5B5470]">内容を編集して保存してください。</p>

      <form action={updatePromptWithId} className="flex flex-col gap-4">
        <Field label="タイトル">
          <input name="title" required minLength={TITLE_MIN_LENGTH} maxLength={TITLE_MAX_LENGTH} defaultValue={prompt.title} className="input" />
        </Field>

        <Field label="説明">
          <input name="description" defaultValue={prompt.description ?? ""} className="input" />
        </Field>

        <Field label="カテゴリ">
          <select name="categoryId" required defaultValue={prompt.category_id} className="input">
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Gemプロンプト">
          <textarea
            name="promptBody"
            required
            rows={6}
            defaultValue={prompt.prompt_body}
            className="input font-mono text-[12.5px]"
          />
        </Field>

        <Field label="使い方">
          <textarea name="usage" rows={3} defaultValue={prompt.usage_example ?? ""} className="input" />
        </Field>

        <Field label="Gemini共有URL（任意）">
          <input name="geminiUrl" defaultValue={prompt.gemini_url ?? ""} className="input" placeholder="https://gemini.google.com/gem/..." />
        </Field>

        <Field label="タグ（カンマ区切り）">
          <input name="tags" defaultValue={currentTags} className="input" />
        </Field>

        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            className="rounded-[14px] px-5 py-3.5 text-[14.5px] font-bold text-white"
            style={{ background: "#4C3FE0" }}
          >
            保存する
          </button>
          <a
            href={`/prompts/${id}`}
            className="rounded-[14px] border px-5 py-3.5 text-[14.5px] font-bold text-[#5B5470]"
            style={{ borderColor: "rgba(23,15,46,0.10)" }}
          >
            キャンセル
          </a>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-[12.5px] font-bold text-[#5B5470]">
      {label}
      {children}
    </label>
  );
}
