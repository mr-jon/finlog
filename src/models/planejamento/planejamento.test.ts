import { calcularPlanejamento } from "./planejamento";

describe("calcularPlanejamento", () => {
  it("calcula a média diária usando o periodo financeiro real, não o mês do calendário", () => {
    // dia 31 configurado, referência outubro/2026, estratégia postergar:
    // período tem 27 dias (calculado no módulo calendário)
    // orçamento de R$2700 -> média diária = 100
    const resultado = calcularPlanejamento(2700, 2026, 9, 31, "postergar");

    expect(resultado.periodo.totalDias).toBe(27);
    expect(resultado.mediaDiaria).toBe(100);
  });
});
