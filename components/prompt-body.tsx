"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { LoginButton } from "./login-button";

export function PromptBody({
  text, isLoggedIn, promptId,
}: { text: string; isLoggedIn: boolean; promptId: string }) {
  const [expanded, setExpanded] = useState(false);
  const lines = text.split("\n");
  const isLong = lines.length > 3;

  // 未ログイン時：常に3行までしか見せない（全文はログインが必要）
  if (!isLoggedIn) {
    const preview = isLong ? lines.slice(0, 3).join("\n") : text;
    return (
      <div className="mb-1.5">
        <div className="relative">
          <div
            className="whitespace-pre-wrap rounded-[10px] bg-[#F1EEFF] p-4 font-mono text-[13px] leading-loose text-[#5B5470]"
            style={isLong ? { maxHeight: 108, overflow: "hidden" } : undefined}
          >
            {preview}
          </div>
          {isLong && (
            <>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-[10px]"
                style={{ background: "linear-gradient(to bottom, rgba(241,238,255,0), rgba(241,238,255,1))" }}
              />
              <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11.5px] font-bold text-[#4C3FE0] shadow">
                  <Lock size={12} /> 続きはログインすると表示されます
                </span>
              </div>
            </>
          )}
        </div>
        {isLong && (
          <div className="mb-4 mt-5 flex justify-center">
            <LoginButton next={`/prompts/${promptId}`} label="ログインして全文を見る" />
          </div>
        )}
        {!isLong && <div className="mb-4" />}
      </div>
    );
  }

  // ログイン済み：3行以下ならそのまま全文表示。3行を超える場合はたたんで表示し、トグルで開閉
  if (!isLong) {
    return (
      <div className="mb-4 whitespace-pre-wrap rounded-[10px] bg-[#F1EEFF] p-4 font-mono text-[13px] leading-loose text-[#5B5470]">
        {text}
      </div>
    );
  }

  const preview = lines.slice(0, 3).join("\n");

  return (
    <div className="mb-4">
      <div className="relative">
        <div
          className="whitespace-pre-wrap rounded-[10px] bg-[#F1EEFF] p-4 font-mono text-[13px] leading-loose text-[#5B5470]"
          style={expanded ? undefined : { maxHeight: 108, overflow: "hidden" }}
        >
          {expanded ? text : preview}
        </div>
        {!expanded && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 rounded-b-[10px]"
            style={{ background: "linear-gradient(to bottom, rgba(241,238,255,0), rgba(241,238,255,1))" }}
          />
        )}
      </div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-2.5 flex items-center gap-1 text-[12.5px] font-bold text-[#4C3FE0]"
      >
        {expanded ? (
          <>たたむ <ChevronUp size={14} /></>
        ) : (
          <>続きを見る（全{lines.length}行） <ChevronDown size={14} /></>
        )}
      </button>
    </div>
  );
}
