import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[13px] uppercase tracking-wide">
          ByMagiq — AI that remembers
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/latticaxon" className="hover:text-ink">
            Latticaxon
          </Link>
          <Link href="/shop" className="hover:text-ink">
            Shop
          </Link>
          <Link href="/exchange" className="hover:text-ink">
            Exchange
          </Link>
          <Link href="/scripting-horizons" className="hover:text-ink">
            Scripting Horizons
          </Link>
          <Link href="/articles" className="hover:text-ink">
            Articles
          </Link>
          <Link href="/newsletter" className="hover:text-ink">
            Newsletter
          </Link>
          <Link href="/about" className="hover:text-ink">
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}
