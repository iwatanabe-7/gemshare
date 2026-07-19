"use client";
import { useState, useTransition } from "react";
import { addComment } from "@/app/actions/comments";

export function CommentForm({ promptId }: { promptId: string }) {
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (!body.trim()) return;
    startTransition(async () => {
      await addComment(promptId, body, rating || undefined);
      setBody("");
      setRating(0);
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n === rating ? 0 : n)}
            className="text-lg"
            style={{ color: n <= rating ? "#F7C948" : "#E4E1F0" }}
          >
            ★
          </button>
        ))}
      </div>
      <div className="flex gap-2.5">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="コメントを書く..."
          className="flex-1 rounded-[10px] border px-3.5 py-2.5 text-[13.5px] outline-none"
          style={{ borderColor: "rgba(23,15,46,0.10)" }}
        />
        <button
          onClick={submit}
          disabled={pending}
          className="rounded-[12px] px-5 text-[13px] font-bold text-white disabled:opacity-60"
          style={{ background: "#4C3FE0" }}
        >
          投稿
        </button>
      </div>
    </div>
  );
}
