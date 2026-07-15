import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles — ByMagiq",
  description:
    "Writing from ByMagiq and Scripting Horizons, published on Medium.",
  alternates: { canonical: "/articles" },
};

const authors = [
  { name: "Dan Rivers", url: "https://medium.com/@sh.dan.rivers" },
  { name: "Mia Bennett", url: "https://medium.com/@sh.mia.bennett" },
  { name: "Ryan Ellis", url: "https://medium.com/@sh.ryan.ellis" },
  { name: "Running Well", url: "https://medium.com/@runningwell4u" },
  { name: "Isla Baird", url: "https://medium.com/@sh.isla.baird" },
  { name: "Simon Hennessy", url: "https://medium.com/@sh.simon.hennessy" },
  { name: "Theo Marlowe", url: "https://medium.com/@scriptinghorizons" },
];

export default function ArticlesPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="font-mono text-[13px] uppercase tracking-wide text-signal">
        Read — Articles
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
        Writing lives on Medium, not here.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
        ByMagiq and Scripting Horizons publish through Medium rather than a
        hosted blog. Pick an author below to read their latest.
      </p>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {authors.map((a) => (
          <li key={a.url}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-4 text-ink transition-colors hover:text-signal"
            >
              <span className="font-display text-lg font-medium">
                {a.name}
              </span>
              <span className="font-mono text-[12px] uppercase tracking-wide text-ink/40">
                Medium →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
