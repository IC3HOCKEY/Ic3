"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
};

/**
 * Full-page canvas overlay that spawns tiny frost / ice-crystal particles
 * at the cursor position. Purely decorative, pointer-events: none.
 * Respects prefers-reduced-motion.
 */
export function IceCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let mouseX = w / 2;
    let mouseY = h / 2;
    let isMoving = false;
    let spawnTimer = 0;

    const particles: Particle[] = [];
    const MAX_PARTICLES = 60;

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;
      clearTimeout(spawnTimer);
      spawnTimer = window.setTimeout(() => (isMoving = false), 100);
    }

    function spawn() {
      if (particles.length >= MAX_PARTICLES) return;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.8;
      particles.push({
        x: mouseX + (Math.random() - 0.5) * 8,
        y: mouseY + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        size: 2 + Math.random() * 4,
        opacity: 0.4 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.1,
      });
    }

    function drawCrystal(
      cx: number,
      cy: number,
      size: number,
      rotation: number,
      alpha: number,
    ) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;

      // Draw a small diamond/crystal shape
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.5, 0);
      ctx.lineTo(0, size * 0.7);
      ctx.lineTo(-size * 0.5, 0);
      ctx.closePath();
      ctx.fillStyle = "rgba(153, 223, 251, 0.7)";
      ctx.fill();

      // Inner glow line
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.6);
      ctx.lineTo(0, size * 0.4);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();
    }

    let raf = 0;
    function loop() {
      raf = requestAnimationFrame(loop);
      if (!ctx) return;

      ctx.clearRect(0, 0, w, h);

      if (isMoving) {
        // Spawn 1–2 particles per frame
        spawn();
        if (Math.random() > 0.5) spawn();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife;
        const alpha = p.opacity * (1 - progress);

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.005; // slight gravity
        p.rotation += p.rotSpeed;
        p.size *= 0.997; // shrink

        drawCrystal(p.x, p.y, p.size, p.rotation, alpha);
      }
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
