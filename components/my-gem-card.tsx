import Link from "next/link";
import { GemCard } from "./gem-card";

export function MyGemCard({ gem }: { gem: any }) {
  return (
    <div className="flex flex-col gap-2">
      <GemCard gem={gem} />
      <div className="flex gap-2 px-1">
        <Link
          href={`/prompts/${gem.id}/edit`}
          className="flex-1 rounded-lg border py-2 text-center text-[12.5px] font-bold text-[#4C3FE0]"
          style={{ borderColor: "rgba(23,15,46,0.10)" }}
        >
          編集する
        </Link>
        <Link
          href={`/prompts/${gem.id}`}
          className="flex-1 rounded-lg border py-2 text-center text-[12.5px] font-bold text-[#5B5470]"
          style={{ borderColor: "rgba(23,15,46,0.10)" }}
        >
          詳細を見る
        </Link>
      </div>
    </div>
  );
}
