"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function SearchBar() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={submit} className="relative max-w-[240px] flex-1">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B84A3]" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Gemを検索..."
        className="w-full rounded-full border py-2 pl-9 pr-3 text-[13px] outline-none"
        style={{ borderColor: "rgba(23,15,46,0.10)" }}
      />
    </form>
  );
}
