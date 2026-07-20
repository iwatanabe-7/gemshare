import { createClient } from "@/lib/supabase/server";
import { LoginButton } from "@/components/login-button";
import { createPrompt } from "@/app/actions/prompts";

export default async function NewPromptPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  if (!user) {
    return (
      <div className="mx-auto max-w-[480px] px-6 py-20 text-center">
        <h1 className="mb-3 text-xl font-extrabold text-[#170F2E]">投稿にはログインが必要です</h1>
        <p className="mb-6 text-sm text-[#5B5470]">
          Gemを投稿するにはGoogleアカウントでのログインが必要です。
        </p>
        <div className="flex justify-center">
          <LoginButton next="/prompts/new" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[620px] px-6 py-9">
      <p className="mb-2 text-xs font-bold tracking-wider text-[#4C3FE0]">POST A GEM</p>
      <h1 className="mb-2 text-2xl font-extrabold text-[#170F2E]">Gemを投稿する</h1>
      <p className="mb-8 text-sm text-[#5B5470]">
        タイトル・説明・プロンプト・使い方を入力してください。
      </p>

      <form action={createPrompt} className="flex flex-col gap-4">
        <Field label="タイトル">
          <input name="title" required className="input" placeholder="例：SEO記事を書くGem" />
        </Field>

        <Field label="説明">
          <input name="description" className="input" placeholder="どんなGemか、一言で説明してください" />
        </Field>

        <Field label="カテゴリ">
          <select name="categoryId" required className="input">
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
            className="input font-mono text-[12.5px]"
            placeholder="プロンプト本文を入力してください"
          />
        </Field>

        <Field label="使い方">
          <textarea
            name="usage"
            rows={3}
            className="input"
            placeholder="貼り付ける際の使い方や置き換え箇所を説明してください"
          />
        </Field>

        <Field label="Gemini共有URL（任意）">
          <input name="geminiUrl" className="input" placeholder="https://gemini.google.com/gem/..." />
        </Field>
        <p className="-mt-2 text-[11.5px] text-[#8B84A3]">
          GemのGem詳細画面で「共有」→「リンクを取得」で発行されるURLです。設定すると、閲覧者がワンクリックでそのGemを直接開けるようになります。
        </p>

        <Field label="タグ（カンマ区切り）">
          <input name="tags" className="input" placeholder="例：SEO, ブログ, Gemini" />
        </Field>

        <button
          type="submit"
          className="mt-2 self-start rounded-[14px] px-5 py-3.5 text-[14.5px] font-bold text-white"
          style={{ background: "#4C3FE0" }}
        >
          投稿する
        </button>
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
