import { createFileRoute, Link } from "@tanstack/react-router";
import { calculators } from "@/lib/calculators";
import { SiteHeader, SiteFooter, AdSlot } from "@/components/site-chrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BusinessCalc — Calculadoras empresariales gratuitas" },
      { name: "description", content: "Calcula márgenes, punto de equilibrio, EBITDA, ROI, CAC, LTV, precio de venta y rentabilidad en segundos." },
      { property: "og:title", content: "BusinessCalc — Calculadoras empresariales" },
      { property: "og:description", content: "Las cifras clave de tu negocio, calculadas en segundos y gratis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6">
        <section className="py-20 md:py-28">
          <p className="eyebrow">Portal de calculadoras para empresas</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
            Las cifras de tu negocio, <em className="text-primary">sin hojas de cálculo.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Ocho calculadoras financieras gratuitas para decidir precios, medir rentabilidad y crecer con datos.
          </p>
        </section>
        <section className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {calculators.map((c, i) => (
            <Link key={c.slug} to="/calculadoras/$slug" params={{ slug: c.slug }} className="calc-tile group">
              <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-8 font-display text-2xl">{c.short}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
              <span className="mt-6 text-sm font-medium text-primary group-hover:underline">Calcular →</span>
            </Link>
          ))}
        </section>
        <div className="my-16"><AdSlot /></div>
      </main>
      <SiteFooter />
    </div>
  );
}
