import { describe, it, expect } from "vitest"
import { calcularStreak } from "./streak"

const d = (s: string) => s + "T12:00:00Z"

describe("calcularStreak", () => {
  const hoje = new Date("2026-06-30T12:00:00Z")

  it("vazio => 0", () => expect(calcularStreak([], hoje)).toBe(0))

  it("so hoje => 1", () => expect(calcularStreak([d("2026-06-30")], hoje)).toBe(1))

  it("3 dias consecutivos ate hoje => 3", () =>
    expect(calcularStreak([d("2026-06-28"), d("2026-06-29"), d("2026-06-30")], hoje)).toBe(3))

  it("duplicados no mesmo dia contam 1", () =>
    expect(calcularStreak([d("2026-06-30"), d("2026-06-30")], hoje)).toBe(1))

  it("termina ontem ainda conta", () =>
    expect(calcularStreak([d("2026-06-28"), d("2026-06-29")], hoje)).toBe(2))

  it("quebra corta a sequencia", () =>
    expect(calcularStreak([d("2026-06-25"), d("2026-06-29"), d("2026-06-30")], hoje)).toBe(2))

  it("ignora nulls", () =>
    expect(calcularStreak([null, undefined, d("2026-06-30")], hoje)).toBe(1))
})
