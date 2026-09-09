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

export function isFeriadoNacional(data: Date): boolean {
  return FERIADOS_FIXOS.some(
    (feriado) =>
      feriado.mes === data.getMonth() && feriado.dia === data.getDate(),
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
