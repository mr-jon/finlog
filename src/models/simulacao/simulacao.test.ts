import { calcularSimulacao } from "../simulacao/simulacao";

describe("calcularSimulacao", () => {
  it("calcula o período e a média diária em dias corridos (sem ajustes)", () => {
    // início bruto 01/10/2026, sem considerar fins de semana nem feriados
    // fim sugerido: 01/11/2026 -> total de 32 dias
    const opcoes = {
      considerarFinsDeSemana: false,
      considerarFeriados: false,
      estrategia: "postergar" as const,
    };

    const resultado = calcularSimulacao(
      3200,
      new Date(2026, 9, 1),
      new Date(2026, 10, 1),
      opcoes,
    );

    expect(resultado.inicio.getDate()).toBe(1);
    expect(resultado.inicio.getMonth()).toBe(9);
    expect(resultado.fim.getDate()).toBe(1);
    expect(resultado.fim.getMonth()).toBe(10);
    expect(resultado.totalDias).toBe(32);
    expect(resultado.mediaDiaria).toBe(100);
  });

  it("calcula o período e a média diária considerando fins de semana e feriados (postergar)", () => {
    // início bruto 31/10/2026 (sábado) -> ajusta pra 03/11 (feriado de Finados empurra)
    // fim sugerido: transborda pro dia 01/12 -> total 29 dias
    // 2900 / 29 = 100

    const opcoes = {
      considerarFinsDeSemana: true,
      considerarFeriados: true,
      estrategia: "postergar" as const,
    };

    const resultado = calcularSimulacao(
      2900,
      new Date(2026, 9, 31),
      new Date(2026, 11, 1),
      opcoes,
    );

    expect(resultado.inicio.getDate()).toBe(3);
    expect(resultado.inicio.getMonth()).toBe(10);
    expect(resultado.fim.getDate()).toBe(1);
    expect(resultado.fim.getMonth()).toBe(11);
    expect(resultado.totalDias).toBe(29);
    expect(resultado.mediaDiaria).toBe(100);
  });
});

describe("calcularSimulacao — validações", () => {
  const opcoesValidas = {
    considerarFinsDeSemana: false,
    considerarFeriados: false,
    estrategia: "postergar" as const,
  };

  it("lança erro quando o orçamento não é um número válido maior que zero", () => {
    expect(() =>
      calcularSimulacao(
        NaN,
        new Date(2026, 9, 1),
        new Date(2026, 10, 1),
        opcoesValidas,
      ),
    ).toThrow();

    expect(() =>
      calcularSimulacao(
        0,
        new Date(2026, 9, 1),
        new Date(2026, 10, 1),
        opcoesValidas,
      ),
    ).toThrow();
  });

  it("lança erro quando a data de início é inválida", () => {
    const dataInvalida = new Date("");
    expect(() =>
      calcularSimulacao(
        3000,
        dataInvalida,
        new Date(2026, 10, 1),
        opcoesValidas,
      ),
    ).toThrow();
  });

  it("lança erro quando a data de fim é inválida", () => {
    const dataInvalida = new Date("");
    expect(() =>
      calcularSimulacao(
        3000,
        new Date(2026, 9, 1),
        dataInvalida,
        opcoesValidas,
      ),
    ).toThrow();
  });
});
