export type Field = { key: string; label: string; suffix?: string; default: number };
export type Result = { label: string; value: number; format: "eur" | "pct" | "num" | "x" };
export type Calculator = {
  slug: string;
  name: string;
  short: string;
  description: string;
  formula: string;
  fields: Field[];
  compute: (v: Record<string, number>) => Result[];
};

const safe = (n: number) => (Number.isFinite(n) ? n : 0);
const g = (v: Record<string, number>, k: string) => v[k] ?? 0;

export const calculators: Calculator[] = [
  {
    slug: "margen",
    name: "Margen de beneficio",
    short: "Margen",
    description: "Calcula el margen bruto y el markup a partir del precio y el coste.",
    formula: "Margen = (Precio − Coste) / Precio",
    fields: [
      { key: "precio", label: "Precio de venta", suffix: "€", default: 100 },
      { key: "coste", label: "Coste del producto", suffix: "€", default: 60 },
    ],
    compute: (v) => {
      const p = g(v, "precio"), c = g(v, "coste");
      return [
        { label: "Margen", value: safe(((p - c) / p) * 100), format: "pct" },
        { label: "Beneficio por unidad", value: p - c, format: "eur" },
        { label: "Markup", value: safe(((p - c) / c) * 100), format: "pct" },
      ];
    },
  },
  {
    slug: "punto-de-equilibrio",
    name: "Punto de equilibrio",
    short: "Break-even",
    description: "Unidades y facturación necesarias para cubrir tus costes fijos.",
    formula: "Unidades = Costes fijos / (Precio − Coste variable)",
    fields: [
      { key: "fijos", label: "Costes fijos mensuales", suffix: "€", default: 10000 },
      { key: "precio", label: "Precio por unidad", suffix: "€", default: 50 },
      { key: "variable", label: "Coste variable por unidad", suffix: "€", default: 30 },
    ],
    compute: (v) => {
      const u = safe(g(v, "fijos") / (g(v, "precio") - g(v, "variable")));
      return [
        { label: "Unidades necesarias", value: Math.ceil(u), format: "num" },
        { label: "Facturación necesaria", value: Math.ceil(u) * g(v, "precio"), format: "eur" },
      ];
    },
  },
  {
    slug: "ebitda",
    name: "EBITDA",
    short: "EBITDA",
    description: "Beneficio operativo antes de intereses, impuestos, depreciaciones y amortizaciones.",
    formula: "EBITDA = Ingresos − Coste de ventas − Gastos operativos",
    fields: [
      { key: "ingresos", label: "Ingresos", suffix: "€", default: 500000 },
      { key: "cogs", label: "Coste de ventas", suffix: "€", default: 200000 },
      { key: "opex", label: "Gastos operativos (sin D&A)", suffix: "€", default: 150000 },
    ],
    compute: (v) => {
      const e = g(v, "ingresos") - g(v, "cogs") - g(v, "opex");
      return [
        { label: "EBITDA", value: e, format: "eur" },
        { label: "Margen EBITDA", value: safe((e / g(v, "ingresos")) * 100), format: "pct" },
      ];
    },
  },
  {
    slug: "roi",
    name: "ROI",
    short: "ROI",
    description: "Retorno sobre la inversión de una campaña, proyecto o compra.",
    formula: "ROI = (Ganancia − Inversión) / Inversión",
    fields: [
      { key: "inversion", label: "Inversión", suffix: "€", default: 5000 },
      { key: "ganancia", label: "Ingresos obtenidos", suffix: "€", default: 8000 },
    ],
    compute: (v) => {
      const i = g(v, "inversion"), r = g(v, "ganancia");
      return [
        { label: "ROI", value: safe(((r - i) / i) * 100), format: "pct" },
        { label: "Beneficio neto", value: r - i, format: "eur" },
      ];
    },
  },
  {
    slug: "cac",
    name: "CAC",
    short: "CAC",
    description: "Coste de adquisición de cliente: cuánto te cuesta conseguir cada cliente.",
    formula: "CAC = (Marketing + Ventas) / Nuevos clientes",
    fields: [
      { key: "marketing", label: "Gasto en marketing", suffix: "€", default: 8000 },
      { key: "ventas", label: "Gasto en ventas", suffix: "€", default: 4000 },
      { key: "clientes", label: "Nuevos clientes", default: 60 },
    ],
    compute: (v) => [
      { label: "CAC", value: safe((g(v, "marketing") + g(v, "ventas")) / g(v, "clientes")), format: "eur" },
    ],
  },
  {
    slug: "ltv",
    name: "LTV",
    short: "LTV",
    description: "Valor de vida del cliente y su relación con el CAC.",
    formula: "LTV = Ticket mensual × Margen × (1 / Churn)",
    fields: [
      { key: "ticket", label: "Ingreso medio mensual por cliente", suffix: "€", default: 50 },
      { key: "margen", label: "Margen bruto", suffix: "%", default: 70 },
      { key: "churn", label: "Churn mensual", suffix: "%", default: 5 },
      { key: "cac", label: "CAC (opcional)", suffix: "€", default: 200 },
    ],
    compute: (v) => {
      const ltv = safe((g(v, "ticket") * (g(v, "margen") / 100)) / (g(v, "churn") / 100));
      return [
        { label: "LTV", value: ltv, format: "eur" },
        { label: "Vida media del cliente (meses)", value: safe(100 / g(v, "churn")), format: "num" },
        { label: "Ratio LTV:CAC", value: safe(ltv / g(v, "cac")), format: "x" },
      ];
    },
  },
  {
    slug: "precio-de-venta",
    name: "Precio de venta",
    short: "Precio",
    description: "Precio necesario para alcanzar el margen deseado, con y sin IVA.",
    formula: "Precio = Coste / (1 − Margen deseado)",
    fields: [
      { key: "coste", label: "Coste", suffix: "€", default: 40 },
      { key: "margen", label: "Margen deseado", suffix: "%", default: 35 },
      { key: "iva", label: "IVA", suffix: "%", default: 21 },
    ],
    compute: (v) => {
      const p = safe(g(v, "coste") / (1 - g(v, "margen") / 100));
      return [
        { label: "Precio sin IVA", value: p, format: "eur" },
        { label: "Precio con IVA", value: p * (1 + g(v, "iva") / 100), format: "eur" },
        { label: "Beneficio por unidad", value: p - g(v, "coste"), format: "eur" },
      ];
    },
  },
  {
    slug: "rentabilidad",
    name: "Rentabilidad (ROE y ROA)",
    short: "Rentabilidad",
    description: "Rentabilidad financiera sobre fondos propios y económica sobre activos.",
    formula: "ROE = Beneficio neto / Fondos propios · ROA = Beneficio neto / Activos",
    fields: [
      { key: "beneficio", label: "Beneficio neto", suffix: "€", default: 60000 },
      { key: "fondos", label: "Fondos propios", suffix: "€", default: 300000 },
      { key: "activos", label: "Activos totales", suffix: "€", default: 750000 },
    ],
    compute: (v) => [
      { label: "ROE", value: safe((g(v, "beneficio") / g(v, "fondos")) * 100), format: "pct" },
      { label: "ROA", value: safe((g(v, "beneficio") / g(v, "activos")) * 100), format: "pct" },
    ],
  },
];

export const getCalculator = (slug: string) => calculators.find((c) => c.slug === slug);

export function formatResult(r: Result) {
  const n = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 });
  if (r.format === "eur") return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(r.value);
  if (r.format === "pct") return `${n.format(r.value)} %`;
  if (r.format === "x") return `${n.format(r.value)}x`;
  return n.format(r.value);
}
