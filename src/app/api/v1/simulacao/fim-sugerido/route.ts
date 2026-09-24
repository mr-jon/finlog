import { NextRequest, NextResponse } from "next/server";
import { calcularFimSugerido } from "@/models/calendario/calendario";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    inicioBruto,
    considerarFinsDeSemana,
    considerarFeriados,
    estrategia,
  } = body;

  try {
    const resultado = calcularFimSugerido(new Date(inicioBruto), {
      considerarFinsDeSemana,
      considerarFeriados,
      estrategia,
    });

    return NextResponse.json(resultado);
  } catch (error) {
    const mensagem =
      error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: mensagem }, { status: 400 });
  }
}
