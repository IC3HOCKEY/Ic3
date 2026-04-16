"use client";

import { useEffect, useRef } from "react";

type Flake = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  wobbleAmp: number;
  wobbleFreq: number;
  wobblePhase: number;
};

/**
 * Subtle falling snow / ice dust across the whole page.
 * Canvas overlay, pointer-events: none, additive blend.
 * Respects prefers-reduced-motion.
 */
export function Snowfall({ count = 50 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = document.documentElement.scrollHeight);

    const flakes: Flake[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 1 + Math.random() * 2.5,
      speed: 0.15 + Math.random() * 0.4,
      opacity: 0.15 + Math.random() * 0.35,
      wobbleAmp: 10 + Math.random() * 30,
      wobbleFreq: 0.005 + Math.random() * 0.01,
      wobblePhase: Math.random() * Math.PI * 2,
    }));

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = document.documentElement.scrollHeight;
    }

    let raf = 0;
    let t = 0;
    function loop() {
      raf = requestAnimationFrame(loop);
      if (!ctx) return;
      t++;

      ctx.clearRect(0, 0, w, h);

      const scrollY = window.scrollY;

      for (const f of flakes) {
        f.y += f.speed;
        if (f.y > h) {
          f.y = -4;
          f.x = Math.random() * w;
        }

        const wx = f.x + Math.sin(t * f.wobbleFreq + f.wobblePhase) * f.wobbleAmp;
        const screenY = f.y - scrollY;

        // Only draw if visible on screen (with some buffer)
        if (screenY < -20 || screenY > window.innerHeight + 20) continue;

        ctx.beginPath();
        ctx.arc(wx, screenY, f.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(153, 223, 251, ${f.opacity})`;
        ctx.fill();

        // Tiny glow
        ctx.beginPath();
        ctx.arc(wx, screenY, f.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(153, 223, 251, ${f.opacity * 0.15})`;
        ctx.fill();
      }
    }

    window.addEventListener("resize", resize);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
