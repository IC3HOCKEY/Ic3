export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center pt-40">
      <div className="flex items-center gap-3 text-ice/80">
        <span className="h-2 w-2 animate-pulse rounded-full bg-ice" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-ice [animation-delay:120ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-ice [animation-delay:240ms]" />
        <span className="ml-2 font-display text-xs uppercase tracking-[0.35em]">
          Laddar
        </span>
      </div>
    </div>
  );
}
