import {
  dataValidaAnterior,
  proximaDataValida,
  calcularPeriodoFinanceiro,
  type OpcoesCalculoPeriodo,
} from "../calendario/calendario";
import { calcularMediaDiaria } from "../orcamento/orcamento";

export function calcularSimulacao(
  orcamento: number,
  inicioBruto: Date,
  fimBruto: Date,
  opcoes: OpcoesCalculoPeriodo,
): { inicio: Date; fim: Date; totalDias: number; mediaDiaria: number } {
  if (!Number.isFinite(orcamento) || orcamento <= 0) {
    throw new Error("O orçamento deve ser um número maior que zero");
  }
  if (Number.isNaN(inicioBruto.getTime())) {
    throw new Error("A data de início é inválida");
  }
  if (Number.isNaN(fimBruto.getTime())) {
    throw new Error("A data de fim é inválida");
  }

  const ajustar =
    opcoes.estrategia === "antecipar" ? dataValidaAnterior : proximaDataValida;

  const inicio = ajustar(inicioBruto, opcoes);
  const fim = ajustar(fimBruto, opcoes);

  const periodo = calcularPeriodoFinanceiro(inicio, fim);
  const mediaDiaria = calcularMediaDiaria(orcamento, periodo.totalDias);

  return { ...periodo, mediaDiaria };
}
