import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link href="/">IC3</Link>
        </div>
        <nav>
          <ul>
            <li><Link href="/">Start</Link></li>
            <li><Link href="/kollektion">Kollektion</Link></li>
            <li><Link href="/limited-drop">Limited Drop</Link></li>
            <li><Link href="/om-oss">Om oss</Link></li>
            <li><Link href="/kontakt">Kontakt</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/privacy">Integritet</Link></li>
            <li><Link href="/cookies">Cookies</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
