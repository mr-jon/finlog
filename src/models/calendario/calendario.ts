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
