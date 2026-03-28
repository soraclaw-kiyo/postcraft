"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "レビュー", href: "/blog?type=review" },
  { label: "比較", href: "/blog?type=comparison" },
  { label: "ブログ", href: "/blog" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-bg-primary/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="text-accent">🤖</span> AIツールナビ
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-text-secondary transition hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary md:hidden"
          aria-label="メニュー"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-border/50 bg-bg-primary px-4 pb-4 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm text-text-secondary transition hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
