import {
  isFeriadoNacional,
  calcularPascoa,
  isDiaUtil,
  proximoDiaUtil,
  diaUtilAnterior,
  calcularDataPagamento,
  calcularPeriodoFinanceiro,
} from "./calendario";

describe("isFeriadoNacional", () => {
  it("reconhece o Ano Novo como feriado", () => {
    expect(isFeriadoNacional(new Date(2026, 0, 1))).toBe(true);
  });

  it("reconhece um dia comum como não-feriado", () => {
    expect(isFeriadoNacional(new Date(2026, 0, 2))).toBe(false);
  });

  it("reconhece o Natal como feriado", () => {
    expect(isFeriadoNacional(new Date(2026, 11, 25))).toBe(true);
  });

  it("reconhece a Sexta-feira Santa de 2026 como feriado", () => {
    // Páscoa 2026 = 5 de abril -> Sexta-feira Santa = 3 de abril
    expect(isFeriadoNacional(new Date(2026, 3, 3))).toBe(true);
  });

  it("reconhece o Carnaval de 2026 como feriado", () => {
    // Páscoa 2026 = 5 de abril -> Carnaval = 17 de fevereiro
    expect(isFeriadoNacional(new Date(2026, 1, 17))).toBe(true);
  });

  it("reconhece o Corpus Christi de 2026 como feriado", () => {
    // Páscoa 2026 = 5 de abril -> CorpusChristi = 4 de junho
    expect(isFeriadoNacional(new Date(2026, 5, 4))).toBe(true);
  });
});

describe("calcularPascoa", () => {
  it("calcula a Páscoa de 2026 corretamente", () => {
    const pascoa = calcularPascoa(2026);
    expect(pascoa.getMonth()).toBe(3); // abril (zero-indexado)
    expect(pascoa.getDate()).toBe(5);
  });

  it("calcula a Páscoa de 2024 corretamente", () => {
    const pascoa = calcularPascoa(2024);
    expect(pascoa.getMonth()).toBe(2); // março
    expect(pascoa.getDate()).toBe(31);
  });
});

describe("isDiaUtil", () => {
  it("considera um sábado como não-útil", () => {
    // 3 de janeiro de 2026 é um sábado
    expect(isDiaUtil(new Date(2026, 0, 3))).toBe(false);
  });

  it("considera um domingo como não-útil", () => {
    // 4 de janeiro de 2026 é um domingo
    expect(isDiaUtil(new Date(2026, 0, 4))).toBe(false);
  });

  it("considera um feriado nacional como não-útil", () => {
    // 1º de janeiro de 2026 é feriado (Ano Novo)
    expect(isDiaUtil(new Date(2026, 0, 1))).toBe(false);
  });

  it("considera uma segunda-feira comum como útil", () => {
    // 5 de janeiro de 2026 é uma segunda-feira comum
    expect(isDiaUtil(new Date(2026, 0, 5))).toBe(true);
  });
});

describe("proximoDiaUtil", () => {
  it("retorna a própria data se já for um dia útil", () => {
    // 5 de janeiro de 2026 é uma segunda-feira comum
    const resultado = proximoDiaUtil(new Date(2026, 0, 5));
    expect(resultado.getDate()).toBe(5);
    expect(resultado.getMonth()).toBe(0);
  });

  it("avança do sábado para a segunda-feira seguinte", () => {
    // 3 de janeiro de 2026 é sábado -> deve retornar 5 de janeiro (segunda)
    const resultado = proximoDiaUtil(new Date(2026, 0, 3));
    expect(resultado.getDate()).toBe(5);
    expect(resultado.getMonth()).toBe(0);
  });

  it("pula um feriado que cai numa sexta-feira", () => {
    // Tiradentes 2026 (21 de abril) cai numa terça-feira
    // então vamos testar um caso onde o 1º cai num feriado
    // 1º de maio de 2026 é uma sexta-feira e é feriado (Dia do Trabalho)
    // o próximo dia útil deve ser 4 de maio (segunda)
    const resultado = proximoDiaUtil(new Date(2026, 4, 1));
    expect(resultado.getDate()).toBe(4);
    expect(resultado.getMonth()).toBe(4);
  });
});

describe("diaUtilAnterior", () => {
  it("retorna a própria data se já for um dia útil", () => {
    const resultado = diaUtilAnterior(new Date(2026, 0, 5));
    expect(resultado.getDate()).toBe(5);
    expect(resultado.getMonth()).toBe(0);
  });

  it("retrocede do domingo para a sexta-feira anterior", () => {
    // 4 de janeiro de 2026 é domingo -> deve retornar 2 de janeiro (sexta)
    const resultado = diaUtilAnterior(new Date(2026, 0, 4));
    expect(resultado.getDate()).toBe(2);
    expect(resultado.getMonth()).toBe(0);
  });

  it("retrocede do feriado de Finados (segunda em 2026) para a sexta-feira anterior", () => {
    // Finados 2026 (2/nov) é segunda-feira -> deve voltar pra sexta, 30/10
    const resultado = diaUtilAnterior(new Date(2026, 10, 2));
    expect(resultado.getDate()).toBe(30);
    expect(resultado.getMonth()).toBe(9);
  });
});

describe("calcularDataPagamento", () => {
  it("retorna o próprio dia configurado se ele já for útil (postergar)", () => {
    // dia 5 configurado, outubro de 2026 -> 5 de outubro é uma segunda-feira comum
    const pagamento = calcularDataPagamento(2026, 9, 5, "postergar");
    expect(pagamento.getDate()).toBe(5);
    expect(pagamento.getMonth()).toBe(9);
  });

  it("empurra o pagamento quando o dia configurado cai num sábado seguido de feriado (postergar)", () => {
    // dia 31 configurado, outubro de 2026:
    // 31/out = sábado, 1/nov = domingo, 2/nov = feriado (Finados) -> pagamento cai em 3/nov
    const pagamento = calcularDataPagamento(2026, 9, 31, "postergar");
    expect(pagamento.getDate()).toBe(3);
    expect(pagamento.getMonth()).toBe(10);
  });

  it("usa o último dia do mês quando o dia configurado não existe (postergar)", () => {
    // dia 31 configurado, fevereiro de 2026 ( não é bissexto, só tem 28 dias)
    // deve cair em 28/02/2026, que já é uma segunda-feira útil
    const pagamento = calcularDataPagamento(2026, 1, 31, "postergar");
    expect(pagamento.getDate()).toBe(2);
    expect(pagamento.getMonth()).toBe(2);
  });

  it("antecipa o pagamento quando o dia configurado cai num sábado seguido de feriado (antecipar)", () => {
    // dia 31 configurado, outubro de 2026:
    // 31/out = sábado -> antecipar deve voltar pro dia útil anterior, 30/out (sexta)
    const pagamento = calcularDataPagamento(2026, 9, 31, "antecipar");
    expect(pagamento.getDate()).toBe(30);
    expect(pagamento.getMonth()).toBe(9);
  });
});

describe("calcularPeriodoFinanceiro", () => {
  it("calcula um período simples de 30 dias sem ajustes de fim de semana/feriado (postergar)", () => {
    // dia 8 configurado: 08/09/2026 (terça) até 07/10/2026 (quarta) = 30 dias
    const periodo = calcularPeriodoFinanceiro(2026, 8, 8, "postergar");
    expect(periodo.inicio.getDate()).toBe(8);
    expect(periodo.inicio.getMonth()).toBe(8); // setembro
    expect(periodo.fim.getDate()).toBe(7);
    expect(periodo.fim.getMonth()).toBe(9); // outubro
    expect(periodo.totalDias).toBe(30);
  });

  it("calcula o período de outubro/2026 considerando sábado, domingo e feriado de Finados (postergar)", () => {
    // dia 31 configurado: pagamento de outubro cai em 03/11 (feriado empurra de 31/out)
    // pagamento de novembro cai em 30/11 -> fim do periodo = 29/11
    const periodo = calcularPeriodoFinanceiro(2026, 9, 31, "postergar");
    expect(periodo.inicio.getDate()).toBe(3);
    expect(periodo.inicio.getMonth()).toBe(10); // novembro
    expect(periodo.fim.getDate()).toBe(29);
    expect(periodo.fim.getMonth()).toBe(10); // novembro
    expect(periodo.totalDias).toBe(27);
  });
});
