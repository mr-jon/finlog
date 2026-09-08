export function calcularMediaDiaria(
  orcamentoMensal: number,
  diasNoMes: number,
): number {
  if (diasNoMes <= 0) {
    throw new Error("O número de dias no Mês deve ser maior que zero");
  }
  return orcamentoMensal / diasNoMes;
}
