
import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-2xl">
          Business<span className="text-primary">Calc</span>
        </Link>
        <span className="hidden font-mono text-xs text-muted-foreground sm:block">
          8 calculadoras · gratis
        </span>
      </div>
    </header>
  );
}

export function AdSlot() {
  return (
    <aside className="ad-slot">
      <span className="eyebrow">Patrocinado</span>
      <p className="mt-2 font-display text-xl">
        Espacio para software y plantillas recomendadas
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Contabilidad, CRM, facturación y plantillas Excel para tu empresa.
      </p>
    </aside>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} BusinessCalc · Resultados orientativos, no constituyen asesoramiento financiero.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <a href="/privacidad" className="hover:underline">
            Política de privacidad y cookies
          </a>
          <a href="mailto:franvidalmartinezz@gmail.com" className="hover:underline">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
