import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 pt-40 text-center">
      <div className="max-w-lg">
        <span className="chip">404</span>
        <h1 className="mt-6 display-heading text-6xl text-ice-50 md:text-8xl">
          Offside.
        </h1>
        <p className="mt-5 text-base text-ice-50/70">
          Sidan du letar efter finns inte — eller så har den sålts slut. Gå
          tillbaka till startsidan och upptäck nästa drop.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Tillbaka till start
          </Link>
          <Link href="/shop" className="btn btn-ghost">
            Till shopen
          </Link>
        </div>
        <nav
          aria-label="Genvägar"
          className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 font-display text-xs uppercase tracking-[0.25em] text-ice-50/50"
        >
          <Link href="/drop-01" className="hover:text-ice">
            Drop 01
          </Link>
          <Link href="/om-oss" className="hover:text-ice">
            Om oss
          </Link>
          <Link href="/kontakt" className="hover:text-ice">
            Kontakt
          </Link>
        </nav>
      </div>
    </div>
  );
}
