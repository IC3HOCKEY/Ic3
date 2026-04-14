"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { cx } from "@/lib/format";

export type FaqItem = {
  q: string;
  a: string;
};

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="flex flex-col divide-y divide-white/5 border-y border-white/5">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <li key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : i)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between gap-4 py-5 text-left transition"
            >
              <span
                className={cx(
                  "font-display text-lg uppercase tracking-[0.15em]",
                  expanded ? "text-ice" : "text-ice-50",
                )}
              >
                {item.q}
              </span>
              <span
                className={cx(
                  "flex h-8 w-8 flex-none items-center justify-center rounded-full border transition",
                  expanded
                    ? "rotate-45 border-ice text-ice"
                    : "border-white/10 text-ice-50/70",
                )}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pr-10 text-sm leading-relaxed text-ice-50/75">
                    {item.a}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
