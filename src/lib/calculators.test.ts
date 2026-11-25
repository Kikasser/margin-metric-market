import { describe, expect, it } from "vitest";
import { getCalculator } from "./calculators";

const run = (slug: string, v: Record<string, number>) => getCalculator(slug)!.compute(v);

describe("calculadoras", () => {
  it("margen: precio 100, coste 60 → 40 %", () => expect(run("margen", { precio: 100, coste: 60 })[0]?.value).toBe(40));
  it("punto de equilibrio: 10000 / (50-30) → 500 uds", () =>
    expect(run("punto-de-equilibrio", { fijos: 10000, precio: 50, variable: 30 })[0]?.value).toBe(500));
  it("ROI: 5000 → 8000 = 60 %", () => expect(run("roi", { inversion: 5000, ganancia: 8000 })[0]?.value).toBe(60));
  it("CAC: 12000 / 60 = 200", () => expect(run("cac", { marketing: 8000, ventas: 4000, clientes: 60 })[0]?.value).toBe(200));
  it("LTV: 50 × 70 % / 5 % = 700", () =>
    expect(run("ltv", { ticket: 50, margen: 70, churn: 5, cac: 200 })[0]?.value).toBeCloseTo(700));
  it("EBITDA: 500k − 200k − 150k = 150k", () =>
    expect(run("ebitda", { ingresos: 500000, cogs: 200000, opex: 150000 })[0]?.value).toBe(150000));
});
