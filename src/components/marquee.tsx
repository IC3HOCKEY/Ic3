type MarqueeProps = {
  items: string[];
  className?: string;
};

export function Marquee({ items, className }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div
      className={
        "relative overflow-hidden border-y border-white/5 bg-ink/60 py-4 " +
        (className ?? "")
      }
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max gap-16 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="display-heading text-3xl tracking-[0.18em] text-ice-50/60"
          >
            {item}
            <span className="ml-16 inline-block h-2 w-2 translate-y-[-0.25em] rounded-full bg-ice" />
          </span>
        ))}
      </div>
    </div>
  );
}
