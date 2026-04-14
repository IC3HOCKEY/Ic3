"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

type RevealSectionProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function RevealSection({
  children,
  delay = 0,
  className,
  ...rest
}: RevealSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
