import { NextRequest, NextResponse } from "next/server";
import { calcularPlanejamento } from "@/models/planejamento/planejamento";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { orcamentoMensal, ano, mes, diaConfigurado, estrategia } = body;

  try {
    const resultado = calcularPlanejamento(
      orcamentoMensal,
      ano,
      mes,
      diaConfigurado,
      estrategia,
    );
    return NextResponse.json(resultado);
  } catch (error) {
    const mensagem =
      error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: mensagem }, { status: 400 });
  }
}
