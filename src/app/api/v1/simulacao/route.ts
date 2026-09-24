import { NextRequest, NextResponse } from "next/server";
import { calcularSimulacao } from "@/models/simulacao/simulacao";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    orcamento,
    inicioBruto,
    fimBruto,
    considerarFinsDeSemana,
    considerarFeriados,
    estrategia,
  } = body;

  try {
    const resultado = calcularSimulacao(
      orcamento,
      new Date(inicioBruto),
      new Date(fimBruto),
      {
        considerarFinsDeSemana,
        considerarFeriados,
        estrategia,
      },
    );

    return NextResponse.json(resultado);
  } catch (error) {
    const mensagem =
      error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: mensagem }, { status: 400 });
  }
}
