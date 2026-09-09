import { isFeriadoNacional, calcularPascoa, isDiaUtil } from "./calendario";

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

  it("reconhece o Carnaval de 2026 como feriado", () => {
    // Páscoa 2026 = 5 de abril -> Carnaval = 17 de fevereiro
    expect(isFeriadoNacional(new Date(2026, 1, 17))).toBe(true);
  });

  it("reconhece o Corpus Christi de 2026 como feriado", () => {
    // Páscoa 2026 = 5 de abril -> CorpusChristi = 4 de junho
    expect(isFeriadoNacional(new Date(2026, 5, 4))).toBe(true);
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

describe("isDiaUtil", () => {
  it("considera um sábado como não-útil", () => {
    // 3 de janeiro de 2026 é um sábado
    expect(isDiaUtil(new Date(2026, 0, 4))).toBe(false);
  });

  it("considera um domingo como não-útil", () => {
    // 4 de janeiro de 2026 é um domingo
    expect(isDiaUtil(new Date(2026, 0, 4))).toBe(false);
  });

  it("considera um feriado nacional como não-útil", () => {
    // 1º de janeiro de 2026 é feriado (Ano Novo)
    expect(isDiaUtil(new Date(2026, 0, 1))).toBe(false);
  });

  it("considera uma segunda-feira comum como útil", () => {
    // 5 de janeiro de 2026 é uma segunda-feira comum
    expect(isDiaUtil(new Date(2026, 0, 5))).toBe(true);
  });
});
