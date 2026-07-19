import Link from "next/link";
import { Heart, Copy, ExternalLink } from "lucide-react";

type Gem = {
  id: string;
  title: string;
  description: string;
  copies: number;
  likes_count: number;
  rating_avg: number;
  gemini_url: string | null;
  category: { name: string; slug: string } | null;
  tags: { tag: { name: string } }[];
};

export function GemCard({ gem }: { gem: Gem }) {
  const tagNames = gem.tags?.map((t) => t.tag?.name).filter(Boolean) ?? [];

  return (
    <Link
      href={`/prompts/${gem.id}`}
      className="block rounded-2xl border border-[rgba(23,15,46,0.10)] bg-white p-[18px] transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-22px_rgba(23,15,46,0.35)]"
    >
      <div className="mb-2.5 flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          {gem.category && (
            <span className="rounded-md bg-[#ECE8FF] px-2.5 py-1 text-[11px] font-bold text-[#4C3FE0]">
              {gem.category.name}
            </span>
          )}
          {gem.gemini_url && (
            <span className="flex items-center gap-1 text-[10.5px] font-bold text-[#8B84A3]">
              <ExternalLink size={11} /> 使ってみる
            </span>
          )}
        </div>
      </div>

      <h3 className="mb-1.5 text-[16px] font-extrabold leading-snug text-[#170F2E]">
        {gem.title}
      </h3>
      <p className="mb-3.5 line-clamp-2 text-[13px] leading-relaxed text-[#5B5470]">
        {gem.description}
      </p>

      <div className="mb-2.5 flex items-center gap-2.5 text-[11.5px] font-semibold text-[#8B84A3]">
        <span className="text-[#F7C948]">
          {"★".repeat(Math.round(gem.rating_avg))}
          {"☆".repeat(5 - Math.round(gem.rating_avg))}
        </span>
        <span>({gem.rating_avg?.toFixed(1) ?? "0.0"})</span>
        <span className="flex items-center gap-1">
          <Copy size={11} /> {gem.copies}
        </span>
        <span className="flex items-center gap-1">
          <Heart size={11} /> {gem.likes_count}
        </span>
      </div>

      {tagNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tagNames.slice(0, 3).map((name) => (
            <span
              key={name}
              className="rounded-md bg-[#F1EEFF] px-2.5 py-1 text-[11.5px] font-semibold text-[#4C3FE0]"
            >
              #{name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}