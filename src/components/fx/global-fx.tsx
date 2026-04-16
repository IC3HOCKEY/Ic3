"use client";

import dynamic from "next/dynamic";

const IceCursor = dynamic(
  () => import("./ice-cursor").then((m) => m.IceCursor),
  { ssr: false },
);

const Snowfall = dynamic(
  () => import("./snowfall").then((m) => m.Snowfall),
  { ssr: false },
);

/**
 * Global FX layer: ice cursor trail + subtle snowfall.
 * Client-only, lazy-loaded, no impact on SSR / first paint.
 */
export function GlobalFX() {
  return (
    <>
      <IceCursor />
      <Snowfall count={40} />
    </>
  );
}
