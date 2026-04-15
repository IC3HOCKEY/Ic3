"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees at the edges. Default 10. */
  intensity?: number;
  /** Show a subtle glare highlight that follows the cursor */
  glare?: boolean;
};

/**
 * Wraps children in a 3D-tilted container that rotates toward the cursor.
 * Uses framer-motion springs so the motion is smooth, not jittery.
 */
export function TiltCard({
  children,
  className,
  intensity = 10,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 160, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 160, damping: 18, mass: 0.4 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);
  const glareX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(153,223,251,0.35), rgba(153,223,251,0) 55%)`,
  );

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
      {glare ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60 mix-blend-screen"
          style={{ background: glareBackground }}
        />
      ) : null}
    </motion.div>
  );
}
