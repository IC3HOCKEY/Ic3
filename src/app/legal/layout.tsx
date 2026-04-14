export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pb-24 pt-40">
      <div className="container-x px-6 md:px-10">
        <article className="prose-legal mx-auto max-w-3xl text-ice-50/80">
          {children}
        </article>
      </div>
      <style>
        {`
          .prose-legal h1 {
            font-family: var(--font-display);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            font-size: clamp(2.5rem, 5vw, 4rem);
            color: #e6edf7;
            margin-bottom: 1.5rem;
          }
          .prose-legal h2 {
            font-family: var(--font-display);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-size: 1.25rem;
            color: #99dffb;
            margin-top: 2.5rem;
            margin-bottom: 0.75rem;
          }
          .prose-legal p, .prose-legal li {
            font-size: 0.95rem;
            line-height: 1.7;
          }
          .prose-legal ul {
            list-style: disc;
            padding-left: 1.25rem;
            margin: 1rem 0;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .prose-legal a { color: #99dffb; text-decoration: underline; }
        `}
      </style>
    </div>
  );
}
