"use client";

import { cx } from "@/lib/format";

type FrostCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Blur intensity (default "md") */
  blur?: "sm" | "md" | "lg" | "xl";
};

const blurMap = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

/**
 * A frosted-glass container with an ice-crystal border glow.
 * Uses backdrop-blur + subtle gradients for a frozen aesthetic.
 */
export function FrostCard({
  children,
  className,
  blur = "md",
}: FrostCardProps) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.04]",
        blurMap[blur],
        className,
      )}
    >
      {/* Top frost edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ice/40 to-transparent"
      />
      {/* Subtle inner frost gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ice/[0.04] via-transparent to-ice/[0.02]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
