"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

type ScrambleTextProps = {
  /** The final resolved text. */
  children: string;
  /** How long (ms) the scramble takes. Default 800. */
  duration?: number;
  /** Delay before scramble starts (ms). Default 0. */
  delay?: number;
  className?: string;
  /** Run once when in viewport. Default true. */
  once?: boolean;
};

/**
 * Text that appears by "scrambling" through random characters
 * before resolving to the final string. Like a digital thaw.
 * Triggers on scroll into viewport.
 */
export function ScrambleText({
  children,
  duration = 800,
  delay = 0,
  className,
  once = true,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const [display, setDisplay] = useState(children);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isInView) return;
    if (once && hasRun.current) return;
    hasRun.current = true;

    const text = children;
    const length = text.length;
    const startTime = performance.now() + delay;

    let raf = 0;

    function tick(now: number) {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);

      // Characters resolve left-to-right, with a scrambling frontier
      const resolvedCount = Math.floor(progress * length);
      let result = "";

      for (let i = 0; i < length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < resolvedCount) {
          result += text[i];
        } else {
          result += randomChar();
        }
      }

      setDisplay(result);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, children, duration, delay, once]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
