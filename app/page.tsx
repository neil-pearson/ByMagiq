import Link from "next/link";

const products = [
  {
    href: "/latticaxon",
    eyebrow: "Flagship product",
    title: "Latticaxon",
    description:
      "A local-first second brain. It keeps what you teach it across every session, so your AI stops re-learning your context from zero each time.",
    cta: "Get Latticaxon",
  },
  {
    href: "/shop",
    eyebrow: "Shop",
    title: "Prompts",
    description:
      "Tested prompts for the workflows that actually compound — research, writing, and systems work.",
    cta: "Browse the shop",
  },
  {
    href: "/scripting-horizons",
    eyebrow: "Read",
    title: "Scripting Horizons",
    description:
      "ByMagiq's publishing imprint — books and long-form writing from a small cast of author personas.",
    cta: "Visit Scripting Horizons",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="grid gap-12 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
          <div>
            <p className="font-mono text-[13px] uppercase tracking-wide text-signal">
              ByMagiq
            </p>
            <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Most AI forgets you the moment you close the tab.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/70">
              ByMagiq builds tools for AI that keeps its memory. Latticaxon,
              our flagship product, is a local-first second brain that
              compounds what you teach it — instead of starting over.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/latticaxon"
                className="inline-flex items-center bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-signal"
              >
                Get Latticaxon
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
              >
                What is ByMagiq?
              </Link>
            </div>
          </div>

          <LatticeMark />
        </div>
      </section>

      {/* Products row */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="font-mono text-[13px] uppercase tracking-wide text-ink/50">
            What ByMagiq makes
          </p>
          <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="flex flex-col justify-between gap-6 bg-paper p-7 transition-colors hover:bg-signal-dim"
              >
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-wide text-signal">
                    {p.eyebrow}
                  </p>
                  <h2 className="mt-3 font-display text-xl font-medium text-ink">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">
                    {p.description}
                  </p>
                </div>
                <span className="text-sm font-medium text-ink underline decoration-line underline-offset-4">
                  {p.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter strip */}
      <section className="border-t border-line bg-ink">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[13px] uppercase tracking-wide text-signal-dim">
              The ByMagiq Letter
            </p>
            <p className="mt-2 max-w-md text-lg text-paper/90">
              One newsletter on building AI that remembers — occasional
              dispatches from Scripting Horizons included.
            </p>
          </div>
          <Link
            href="/newsletter"
            className="inline-flex items-center justify-center bg-paper px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-signal-dim"
          >
            Subscribe
          </Link>
        </div>
      </section>
    </>
  );
}

function LatticeMark() {
  const nodes: [number, number][] = [
    [20, 30],
    [90, 15],
    [150, 45],
    [40, 90],
    [110, 100],
    [170, 80],
    [70, 150],
    [140, 160],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 4],
    [2, 5],
    [3, 4],
    [4, 5],
    [3, 6],
    [4, 7],
    [5, 7],
    [6, 7],
  ];
  return (
    <svg
      viewBox="0 0 190 180"
      className="mx-auto h-auto w-full max-w-xs text-ink/25 sm:max-w-sm"
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === 4 ? 5 : 3}
          className={i === 4 ? "fill-signal" : "fill-current"}
        />
      ))}
    </svg>
  );
}
