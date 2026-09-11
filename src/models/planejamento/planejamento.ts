import {
  calcularPeriodoFinanceiro,
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
  const periodo = calcularPeriodoFinanceiro(
    ano,
    mes,
    diaConfigurado,
    estrategia,
  );
  const mediaDiaria = calcularMediaDiaria(orcamentoMensal, periodo.totalDias);

  return { periodo, mediaDiaria };
}
