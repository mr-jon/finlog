import {
  calcularFimSugerido,
  calcularPeriodoFinanceiro,
  type OpcoesCalculoPeriodo,
} from "../calendario/calendario";
import { calcularMediaDiaria } from "../orcamento/orcamento";

export function calcularSimulacao(
  orcamento: number,
  inicioBruto: Date,
  opcoes: OpcoesCalculoPeriodo,
): { inicio: Date; fim: Date; totalDias: number; mediaDiaria: number } {
  const { inicioAjustado, fimSugerido } = calcularFimSugerido(
    inicioBruto,
    opcoes,
  );
  const periodo = calcularPeriodoFinanceiro(inicioAjustado, fimSugerido);
  const mediaDiaria = calcularMediaDiaria(orcamento, periodo.totalDias);

  return { ...periodo, mediaDiaria };
}
