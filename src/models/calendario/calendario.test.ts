import { isFeriadoNacional, calcularPascoa } from "./calendario";

describe("isFeriadoNacional", () => {
  it("reconhece o Ano Novo como feriado", () => {
    expect(isFeriadoNacional(new Date(2026, 0, 1))).toBe(true);
  });

  it("reconhece um dia comum como não-feriado", () => {
    expect(isFeriadoNacional(new Date(2026, 0, 2))).toBe(false);
  });

  it("reconhece o Natal como feriado", () => {
    expect(isFeriadoNacional(new Date(2026, 11, 25))).toBe(true);
  });

  it("reconhece a Sexta-feira Santa de 2026 como feriado", () => {
    // Páscoa 2026 = 5 de abril -> Sexta-feira Santa = 3 de abril
    expect(isFeriadoNacional(new Date(2026, 3, 3))).toBe(true);
  });
});

describe("calcularPascoa", () => {
  it("calcula a Páscoa de 2026 corretamente", () => {
    const pascoa = calcularPascoa(2026);
    expect(pascoa.getMonth()).toBe(3); // abril (zero-indexado)
    expect(pascoa.getDate()).toBe(5);
  });

  it("calcula a Páscoa de 2024 corretamente", () => {
    const pascoa = calcularPascoa(2024);
    expect(pascoa.getMonth()).toBe(2); // março
    expect(pascoa.getDate()).toBe(31);
  });
});
