export function Logo({ size = 34 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="flex items-center justify-center rounded-xl border-2"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg,#7A6BFF,#5FF5DC)",
          borderColor: "#170F2E",
        }}
      >
        <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L20 8L12 22L4 8L12 2Z" fill="#170F2E" fillOpacity="0.88" />
        </svg>
      </span>
      <span className="text-lg font-black tracking-tight text-[#170F2E]">GemShare</span>
    </span>
  );
}
