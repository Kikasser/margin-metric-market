import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { calculators, formatResult, getCalculator } from "@/lib/calculators";
import { SiteHeader, SiteFooter, AdSlot } from "@/components/site-chrome";

export const Route = createFileRoute("/calculadoras/$slug")({
  loader: ({ params }) => {
    const c = getCalculator(params.slug);
    if (!c) throw notFound();
    return { slug: c.slug };
  },
  head: ({ params }) => {
    const c = getCalculator(params.slug);
    const title = c ? `Calculadora de ${c.name} — BusinessCalc` : "Calculadora no encontrada — BusinessCalc";
    const desc = c?.description ?? "Esta calculadora no existe.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CalcPage,
});

function CalcPage() {
  const { slug } = Route.useLoaderData();
  return <Calc key={slug} slug={slug} />;
}

function Calc({ slug }: { slug: string }) {
  const c = getCalculator(slug)!;
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(c.fields.map((f) => [f.key, f.default])),
  );
  const results = c.compute(values);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-14">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Todas las calculadoras</Link>
        <h1 className="mt-6 font-display text-4xl md:text-6xl">{c.name}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{c.description}</p>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <form className="space-y-5 rounded-lg border bg-card p-6" onSubmit={(e) => e.preventDefault()}>
            {c.fields.map((f) => (
              <label key={f.key} className="block">
                <span className="text-sm font-medium">{f.label}</span>
                <div className="mt-1.5 flex items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={Number.isNaN(values[f.key]) ? "" : values[f.key]}
                    onChange={(e) => setValues({ ...values, [f.key]: parseFloat(e.target.value) })}
                    className="w-full bg-transparent px-3 py-2.5 font-mono outline-none"
                  />
                  {f.suffix && <span className="px-3 font-mono text-sm text-muted-foreground">{f.suffix}</span>}
                </div>
              </label>
            ))}
            <p className="border-t pt-4 font-mono text-xs text-muted-foreground">{c.formula}</p>
          </form>
          <div className="result-panel">
            <span className="eyebrow opacity-70">Resultado</span>
            <dl className="mt-6 space-y-6">
              {results.map((r) => (
                <div key={r.label}>
                  <dt className="text-sm opacity-80">{r.label}</dt>
                  <dd className="font-mono text-4xl">{formatResult(r)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="mt-14"><AdSlot /></div>
        <nav className="mt-14">
          <p className="eyebrow">Otras calculadoras</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {calculators.filter((o) => o.slug !== slug).map((o) => (
              <Link key={o.slug} to="/calculadoras/$slug" params={{ slug: o.slug }} className="rounded-full border px-4 py-1.5 text-sm hover:bg-accent">
                {o.short}
              </Link>
            ))}
          </div>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
