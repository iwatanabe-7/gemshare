"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3x3, TrendingUp, Plus, User } from "lucide-react";

const LEFT_ITEMS = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/categories", label: "カテゴリ", icon: Grid3x3 },
];
const RIGHT_ITEMS = [
  { href: "/ranking", label: "ランキング", icon: TrendingUp },
  { href: "/my", label: "マイページ", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around bg-white px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 md:hidden"
      style={{ borderTop: "2px solid #170F2E" }}
    >
      {LEFT_ITEMS.map((item) => (
        <NavItem key={item.href} item={item} active={pathname === item.href} />
      ))}

      <Link
        href="/prompts/new"
        aria-label="Gemを投稿する"
        className="-mt-7 flex h-14 w-14 items-center justify-center rounded-full"
        style={{
          background: "linear-gradient(135deg,#7A6BFF,#5FF5DC)",
          border: "2px solid #170F2E",
          boxShadow: "3px 3px 0 #170F2E",
        }}
      >
        <Plus size={24} color="#170F2E" strokeWidth={2.6} />
      </Link>

      {RIGHT_ITEMS.map((item) => (
        <NavItem key={item.href} item={item} active={pathname === item.href} />
      ))}
    </nav>
  );
}

function NavItem({
  item, active,
}: { item: { href: string; label: string; icon: any }; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="flex flex-col items-center gap-1 px-3 py-1"
      style={{ color: active ? "#4C3FE0" : "#8B84A3" }}
    >
      <Icon size={20} strokeWidth={active ? 2.6 : 2} />
      <span className="text-[10px] font-bold">{item.label}</span>
    </Link>
  );
}
