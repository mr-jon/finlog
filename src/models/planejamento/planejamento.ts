import {
  calcularPeriodoFinanceiro,
  calcularDataPagamento,
  adicionarDias,
  type EstrategiaAjusteDiaUtil,
} from "../calendario/calendario";
import { calcularMediaDiaria } from "../orcamento/orcamento";

export function calcularPlanejamento(
  orcamentoMensal: number,
  ano: number,
  mes: number,
  diaConfigurado: number,
  estrategia: EstrategiaAjusteDiaUtil,
): {
  periodo: { inicio: Date; fim: Date; totalDias: number };
  mediaDiaria: number;
} {
  const inicio = calcularDataPagamento(ano, mes, diaConfigurado, estrategia);

  const anoProximoPagamento = mes === 11 ? ano + 1 : ano;
  const mesProximoPagamento = mes === 11 ? 0 : mes + 1;
  const proximoPagamento = calcularDataPagamento(
    anoProximoPagamento,
    mesProximoPagamento,
    diaConfigurado,
    estrategia,
  );
  const fim = adicionarDias(proximoPagamento, -1);

  const periodo = calcularPeriodoFinanceiro(inicio, fim);
  const mediaDiaria = calcularMediaDiaria(orcamentoMensal, periodo.totalDias);

  return { periodo, mediaDiaria };
}
