import Link from "next/link";

const readLinks = [
  { href: "/scripting-horizons", label: "Scripting Horizons" },
  { href: "/articles", label: "Articles" },
];

const allLinks = [
  { href: "/latticaxon", label: "Latticaxon" },
  { href: "/shop", label: "Shop" },
  { href: "/exchange", label: "Exchange" },
  { href: "/scripting-horizons", label: "Scripting Horizons" },
  { href: "/articles", label: "Articles" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  return (
    <header className="relative border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-lg font-medium tracking-tight text-ink"
        >
          ByMagiq
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 font-mono text-[13px] uppercase tracking-wide text-ink/70 md:flex">
          <Link href="/latticaxon" className="transition-colors hover:text-ink">
            Latticaxon
          </Link>
          <Link href="/shop" className="transition-colors hover:text-ink">
            Shop
          </Link>
          <Link href="/exchange" className="transition-colors hover:text-ink">
            Exchange
          </Link>
          <details className="relative">
            <summary className="cursor-pointer list-none transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
              Read
            </summary>
            <div className="absolute left-0 top-full z-10 mt-3 w-56 border border-line bg-paper py-2 normal-case tracking-normal shadow-sm">
              {readLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block px-4 py-2 text-sm text-ink/80 hover:bg-signal-dim hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
          <Link href="/newsletter" className="transition-colors hover:text-ink">
            Newsletter
          </Link>
          <Link href="/about" className="transition-colors hover:text-ink">
            About
          </Link>
        </nav>

        {/* Mobile nav */}
        <details className="md:hidden">
          <summary className="cursor-pointer list-none font-mono text-[13px] uppercase tracking-wide text-ink [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <div className="absolute inset-x-0 top-full z-10 border-b border-line bg-paper px-6 py-4">
            <div className="flex flex-col gap-3 font-mono text-[13px] uppercase tracking-wide text-ink/80">
              {allLinks.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-ink">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
