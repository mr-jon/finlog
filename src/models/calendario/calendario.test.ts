import { isFeriadoNacional } from "./calendario";

describe("isFeriadoNacional", () => {
  it("reconhece o Ano Novo como feriado", () => {
    expect(isFeriadoNacional(new Date(2026, 0, 1))).toBe(true);
  });

  it("reconhece um dia comum como não-feriado", () => {
    expect(isFeriadoNacional(new Date(2026, 0, 2))).toBe(false);
  });
});
