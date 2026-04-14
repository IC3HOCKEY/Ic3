"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "@/lib/format";
import type { ProductImage } from "@/lib/types";

type TurntableProps = {
  images: ProductImage[];
  /** Alt label prefix */
  name: string;
};

export function Turntable({ images, name }: TurntableProps) {
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; index: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoPlay || dragging || images.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 140);
    return () => window.clearInterval(id);
  }, [autoPlay, dragging, images.length]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      setAutoPlay(false);
      setDragging(true);
      startRef.current = { x: event.clientX, index };
      (event.target as Element).setPointerCapture(event.pointerId);
    },
    [index],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging || !startRef.current || !containerRef.current) return;
      const delta = event.clientX - startRef.current.x;
      const width = containerRef.current.clientWidth;
      const frames = Math.round((delta / width) * images.length * 2);
      const next =
        (startRef.current.index - frames + images.length * 10) % images.length;
      setIndex(next);
    },
    [dragging, images.length],
  );

  const onPointerUp = useCallback(() => {
    setDragging(false);
    startRef.current = null;
  }, []);

  if (!images.length) return null;
  const active = images[index];

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={containerRef}
        role="img"
        aria-label={`${name} — rotera för att se från alla vinklar`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        className={cx(
          "relative aspect-square w-full overflow-hidden rounded-sm bg-gradient-to-br from-ink via-steel-900 to-ink",
          dragging ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        <Image
          src={active.url}
          alt={active.altText ?? name}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          className="select-none object-cover will-change-transform"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(153,223,251,0.12)_0%,transparent_60%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <span className="rounded-full border border-white/10 bg-ink/60 px-4 py-1.5 font-display text-[0.65rem] uppercase tracking-[0.3em] text-ice-50/80 backdrop-blur">
            360° · dra för att rotera
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Visa vinkel ${i + 1}`}
              onClick={() => {
                setIndex(i);
                setAutoPlay(false);
              }}
              className={cx(
                "h-1.5 w-6 rounded-full transition",
                i === index ? "bg-ice" : "bg-white/10 hover:bg-white/30",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setAutoPlay((v) => !v)}
          className="text-xs uppercase tracking-[0.25em] text-ice-50/60 hover:text-ice"
        >
          {autoPlay ? "Pausa rotation" : "Starta rotation"}
        </button>
      </div>
    </div>
  );
}
