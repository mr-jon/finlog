import { calcularMediaDiaria } from "./orcamento";

describe("calcularMediaDiaria", () => {
  it("divide o orçamento mensal igualmente pelos dias do mês", () => {
    const resultado = calcularMediaDiaria(3000, 30);
    expect(resultado).toBe(100);
  });
  it("lança um erro se o mês tiver 0 dias", () => {
    expect(() => calcularMediaDiaria(3000, 0)).toThrow();
  });
});

function teste() {
  console.log("teste");
}

function teste2() {
  console.log("teste2");
}
