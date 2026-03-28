"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  /** JSON-LDはサーバーコンポーネント側で出力する想定 */
}

function FAQAccordion({ question, answer }: FAQItem) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-text-primary">{question}</span>
        <span
          className={`shrink-0 text-xl text-accent transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm leading-7 text-text-secondary">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ({ items }: FAQProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
        よくある<span className="text-accent">質問</span>
      </h2>
      <div className="rounded-2xl border border-border bg-bg-secondary p-6">
        {items.map((item) => (
          <FAQAccordion key={item.question} {...item} />
        ))}
      </div>
    </section>
  );
}
