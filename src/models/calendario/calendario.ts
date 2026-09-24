const FERIADOS_FIXOS: Array<{ mes: number; dia: number }> = [
  { mes: 0, dia: 1 }, // Confraternização Universal
  { mes: 3, dia: 21 }, // Tiradentes
  { mes: 4, dia: 1 }, // Dia do Trabalho
  { mes: 8, dia: 7 }, // Independência
  { mes: 9, dia: 12 }, // Nossa Senhora Aparecida
  { mes: 10, dia: 2 }, // Finados
  { mes: 10, dia: 15 }, // Proclamação da República
  { mes: 11, dia: 25 }, // Natal
];

export function adicionarDias(data: Date, dias: number): Date {
  const resultado = new Date(data);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}

function mesmaData(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isFeriadoNacional(data: Date): boolean {
  const ehFeriadoFixo = FERIADOS_FIXOS.some(
    (feriado) =>
      feriado.mes === data.getMonth() && feriado.dia === data.getDate(),
  );
  if (ehFeriadoFixo) return true;

  const pascoa = calcularPascoa(data.getFullYear());
  const sextaFeiraSanta = adicionarDias(pascoa, -2);
  const carnaval = adicionarDias(pascoa, -47);
  const corpusChristi = adicionarDias(pascoa, 60);

  return [sextaFeiraSanta, carnaval, corpusChristi].some((feriado) =>
    mesmaData(feriado, data),
  );
}

export function calcularPascoa(ano: number): Date {
  const cicloLunarMetonico = ano % 19;
  const seculo = Math.floor(ano / 100);
  const anoDoSeculo = ano % 100;
  const seculoBissexto = Math.floor(seculo / 4);
  const seculoRestante = seculo % 4;
  const correcaoLunar = Math.floor((seculo + 8) / 25);
  const correcaoLunarAjustada = Math.floor((seculo - correcaoLunar + 1) / 3);
  const epacta =
    (19 * cicloLunarMetonico +
      seculo -
      seculoBissexto -
      correcaoLunarAjustada +
      15) %
    30;
  const anoBissextoDoSeculo = Math.floor(anoDoSeculo / 4);
  const anoRestante = anoDoSeculo % 4;
  const diasAteDomingo =
    (32 + 2 * seculoRestante + 2 * anoBissextoDoSeculo - epacta - anoRestante) %
    7;
  const correcaoSecularMes = Math.floor(
    (cicloLunarMetonico + 11 * epacta + 22 * diasAteDomingo) / 451,
  );
  const mes = Math.floor(
    (epacta + diasAteDomingo - 7 * correcaoSecularMes + 114) / 31,
  );
  const dia =
    ((epacta + diasAteDomingo - 7 * correcaoSecularMes + 114) % 31) + 1;

  return new Date(ano, mes - 1, dia);
}

export function isDiaUtil(data: Date): boolean {
  return diaEhValido(data, {
    considerarFinsDeSemana: true,
    considerarFeriados: true,
  });
}

export function proximoDiaUtil(data: Date): Date {
  let candidato = new Date(data);

  while (!isDiaUtil(candidato)) {
    candidato = adicionarDias(candidato, 1);
  }

  return candidato;
}

export function diaUtilAnterior(data: Date): Date {
  let candidato = new Date(data);

  while (!isDiaUtil(candidato)) {
    candidato = adicionarDias(candidato, -1);
  }

  return candidato;
}

function ultimoDiaDoMes(ano: number, mes: number): number {
  return new Date(ano, mes + 1, 0).getDate();
}

export type EstrategiaAjusteDiaUtil = "antecipar" | "postergar";

export function calcularDataPagamento(
  ano: number,
  mes: number,
  diaConfigurado: number,
  estrategia: EstrategiaAjusteDiaUtil,
): Date {
  const ultimoDia = ultimoDiaDoMes(ano, mes);
  const diaAjustado = Math.min(diaConfigurado, ultimoDia);
  const dataBase = new Date(ano, mes, diaAjustado);

  return estrategia === "antecipar"
    ? diaUtilAnterior(dataBase)
    : proximoDiaUtil(dataBase);
}

export function calcularPeriodoFinanceiro(
  inicio: Date,
  fim: Date,
): { inicio: Date; fim: Date; totalDias: number } {
  return { inicio, fim, totalDias: contarDiasEntre(inicio, fim) };
}

function contarDiasEntre(inicio: Date, fim: Date): number {
  const umDiaEmMilissegundos = 1000 * 60 * 60 * 24;
  return (
    Math.round((fim.getTime() - inicio.getTime()) / umDiaEmMilissegundos) + 1
  );
}

type OpcoesValidacaoDia = {
  considerarFinsDeSemana: boolean;
  considerarFeriados: boolean;
};

export function diaEhValido(data: Date, opcoes: OpcoesValidacaoDia): boolean {
  const diaDaSemana = data.getDay();
  const ehFimDeSemana = diaDaSemana === 0 || diaDaSemana === 6;

  if (opcoes.considerarFinsDeSemana && ehFimDeSemana) return false;
  if (opcoes.considerarFeriados && isFeriadoNacional(data)) return false;

  return true;
}

export function proximaDataValida(
  data: Date,
  opcoes: OpcoesValidacaoDia,
): Date {
  let candidato = new Date(data);

  while (!diaEhValido(candidato, opcoes)) {
    candidato = adicionarDias(candidato, 1);
  }

  return candidato;
}

export function dataValidaAnterior(
  data: Date,
  opcoes: OpcoesValidacaoDia,
): Date {
  let candidato = new Date(data);

  while (!diaEhValido(candidato, opcoes)) {
    candidato = adicionarDias(candidato, -1);
  }

  return candidato;
}

function calcularDataMesmoDiaProximoMes(
  dataBruta: Date,
  estrategia: EstrategiaAjusteDiaUtil,
): Date {
  const diaOriginal = dataBruta.getDate();
  const anoSeguinte =
    dataBruta.getMonth() === 11
      ? dataBruta.getFullYear() + 1
      : dataBruta.getFullYear();
  const mesSeguinte =
    dataBruta.getMonth() === 11 ? 0 : dataBruta.getMonth() + 1;

  if (estrategia === "antecipar") {
    const ultimoDia = ultimoDiaDoMes(anoSeguinte, mesSeguinte);
    const diaAjustado = Math.min(diaOriginal, ultimoDia);
    return new Date(anoSeguinte, mesSeguinte, diaAjustado);
  }

  // postergar: deixa o próprio Javascript "transbordar" pro mês seguinte quando o dia não existe
  return new Date(anoSeguinte, mesSeguinte, diaOriginal);
}

export type OpcoesCalculoPeriodo = OpcoesValidacaoDia & {
  estrategia: EstrategiaAjusteDiaUtil;
};

export function calcularFimSugerido(
  inicioBruto: Date,
  opcoes: OpcoesCalculoPeriodo,
): { inicioAjustado: Date; fimSugerido: Date } {
  const ajustar =
    opcoes.estrategia === "antecipar" ? dataValidaAnterior : proximaDataValida;

  const inicioAjustado = ajustar(inicioBruto, opcoes);
  const fimBruto = calcularDataMesmoDiaProximoMes(
    inicioBruto,
    opcoes.estrategia,
  );
  const fimSugerido = ajustar(fimBruto, opcoes);

  return { inicioAjustado, fimSugerido };
}
