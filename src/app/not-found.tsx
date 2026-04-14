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
        <Link href="/" className="btn btn-primary mt-8">
          Tillbaka till start
        </Link>
      </div>
    </div>
  );
}
