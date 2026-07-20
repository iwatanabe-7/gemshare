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
      className="hard-card block rounded-[22px] bg-white p-5"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {gem.category && (
            <span
              className="rounded-full border-2 px-2.5 py-1 text-[10.5px] font-extrabold"
              style={{ background: "#F7C948", borderColor: "#170F2E", color: "#170F2E" }}
            >
              {gem.category.name}
            </span>
          )}
          {gem.gemini_url && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#8B84A3]">
              <ExternalLink size={11} /> 使ってみる
            </span>
          )}
        </div>
      </div>

      <h3 className="mb-1.5 text-[16px] font-extrabold leading-snug text-[#170F2E]">
        {gem.title}
      </h3>
      <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-[#5B5470]">
        {gem.description}
      </p>

      <div className="mb-3 flex items-center gap-2.5 text-[11.5px] font-bold text-[#170F2E]">
        <span style={{ color: "#c9931a" }}>
          {"★".repeat(Math.round(gem.rating_avg))}
          {"☆".repeat(5 - Math.round(gem.rating_avg))}
        </span>
        <span className="text-[#8B84A3]">({gem.rating_avg?.toFixed(1) ?? "0.0"})</span>
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
              className="rounded-full border-2 px-2.5 py-1 text-[11px] font-bold text-[#4C3FE0]"
              style={{ borderColor: "#170F2E" }}
            >
              #{name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
