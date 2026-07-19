import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CopyButton } from "@/components/copy-button";
import { FavoriteButton } from "@/components/favorite-button";
import { CommentForm } from "@/components/comment-form";
import { ExternalLink } from "lucide-react";

export default async function PromptDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: prompt } = await supabase
    .from("prompts")
    .select(`
      *,
      category:categories(name),
      tags:prompt_tags(tag:tags(name)),
      comments(id, body, rating, created_at, author:profiles(name))
    `)
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (!prompt) notFound();

  // 閲覧数カウント（失敗しても画面表示は継続）
  await supabase.rpc("increment_view", { p_prompt_id: id });

  let isFavorited = false;
  if (user) {
    const { data: fav } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("prompt_id", id)
      .maybeSingle();
    isFavorited = !!fav;
  }

  const tagNames = prompt.tags?.map((t: any) => t.tag?.name).filter(Boolean) ?? [];
  const comments = prompt.comments ?? [];

  return (
    <div className="mx-auto max-w-[680px] px-6 py-9">
      {prompt.category && (
        <span className="rounded-md bg-[#ECE8FF] px-2.5 py-1 text-[11.5px] font-bold text-[#4C3FE0]">
          {prompt.category.name}
        </span>
      )}
      <h1 className="my-3.5 text-2xl font-extrabold text-[#170F2E]">{prompt.title}</h1>
      <p className="mb-3.5 text-sm text-[#5B5470]">{prompt.description}</p>

      <div className="mb-4 flex items-center gap-3.5 text-[12.5px] font-semibold text-[#8B84A3]">
        <span className="text-[#F7C948]">
          {"★".repeat(Math.round(prompt.rating_avg))}
          {"☆".repeat(5 - Math.round(prompt.rating_avg))}
        </span>
        <span>({prompt.rating_avg?.toFixed(1) ?? "0.0"})</span>
        <span>{prompt.views}回閲覧</span>
      </div>

      {tagNames.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-1.5">
          {tagNames.map((name: string) => (
            <span key={name} className="rounded-md bg-[#F1EEFF] px-2.5 py-1 text-[11.5px] font-semibold text-[#4C3FE0]">
              #{name}
            </span>
          ))}
        </div>
      )}

      <div className="mb-2 text-[11.5px] font-bold tracking-wide text-[#8B84A3]">GEMプロンプト</div>
      <div className="mb-4 whitespace-pre-wrap rounded-[10px] bg-[#F1EEFF] p-4 font-mono text-[13px] leading-loose text-[#5B5470]">
        {prompt.prompt_body}
      </div>

      {prompt.usage_example && (
        <>
          <div className="mb-2 text-[11.5px] font-bold tracking-wide text-[#8B84A3]">使い方</div>
          <div className="mb-5 text-[13.5px] leading-loose text-[#5B5470]">{prompt.usage_example}</div>
        </>
      )}

      {prompt.gemini_url && (
        <a
          href={prompt.gemini_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 flex items-center justify-center gap-2 rounded-[14px] p-3.5 text-[14.5px] font-bold text-white"
          style={{ background: "linear-gradient(135deg,#4C3FE0,#3427A8)" }}
        >
          <ExternalLink size={16} /> このGemを使ってみる
        </a>
      )}

      <div className="mb-2 flex gap-3">
        <CopyButton id={prompt.id} text={prompt.prompt_body} copies={prompt.copies} isLoggedIn={!!user} />
        <FavoriteButton id={prompt.id} likesCount={prompt.likes_count} isFavorited={isFavorited} isLoggedIn={!!user} />
      </div>
      {!user && (
        <p className="mb-8 text-[11.5px] text-[#8B84A3]">
          プロンプトのコピー・お気に入りはGoogleログイン済みのユーザーのみご利用いただけます。
        </p>
      )}
      {user && <div className="mb-8" />}

      <h3 className="mb-4 text-[15.5px] font-extrabold text-[#170F2E]">
        コメント（{comments.length}）
      </h3>
      <div className="mb-4 flex flex-col gap-3">
        {comments.map((c: any) => (
          <div key={c.id} className="rounded-xl border p-3.5" style={{ borderColor: "rgba(23,15,46,0.10)" }}>
            <div className="mb-1 text-[12.5px] font-bold">
              {c.author?.name ?? "ユーザー"}
              {c.rating && <span className="ml-2 text-[#F7C948]">{"★".repeat(c.rating)}</span>}
              <span className="ml-2 font-normal text-[#8B84A3]">
                {new Date(c.created_at).toLocaleDateString("ja-JP")}
              </span>
            </div>
            <div className="text-[13.5px] text-[#5B5470]">{c.body}</div>
          </div>
        ))}
        {comments.length === 0 && <div className="text-[13px] text-[#8B84A3]">まだコメントはありません。</div>}
      </div>

      {user ? (
        <CommentForm promptId={prompt.id} />
      ) : (
        <p className="text-[13px] text-[#8B84A3]">コメントするにはログインが必要です。</p>
      )}
    </div>
  );
}
