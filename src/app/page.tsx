"use client";

import { useState } from "react";

type Estrategia = "antecipar" | "postergar";

type Resultado = {
  inicio: string;
  fim: string;
  totalDias: number;
  mediaDiaria: number;
};

function formatarDataInput(data: Date): string {
  return data.toISOString().slice(0, 10);
}

function adicionarUmMes(dataISO: string): string {
  const data = new Date(dataISO + "T00:00:00");
  data.setMonth(data.getMonth() + 1);
  return formatarDataInput(data);
}

function montarRotuloAjuste(
  considerarFinsDeSemana: boolean,
  considerarFeriados: boolean,
): string {
  if (considerarFinsDeSemana && considerarFeriados) {
    return "Quando a data cair em final de semana ou feriado:";
  }
  if (considerarFinsDeSemana) {
    return "Quando a data cair em final de semana:";
  }
  if (considerarFeriados) {
    return "Quando a data cair em feriado:";
  }
  return "";
}

function valoresIniciais() {
  const hoje = formatarDataInput(new Date());
  return {
    orcamento: "",
    inicio: hoje,
    fim: adicionarUmMes(hoje),
    considerarFinsDeSemana: false,
    considerarFeriados: false,
    estrategia: "postergar" as Estrategia,
  };
}

export default function Home() {
  const [orcamento, setOrcamento] = useState(valoresIniciais().orcamento);
  const [inicio, setInicio] = useState(valoresIniciais().inicio);
  const [fim, setFim] = useState(valoresIniciais().fim);
  const [considerarFinsDeSemana, setConsiderarFinsDeSemana] = useState(false);
  const [considerarFeriados, setConsiderarFeriados] = useState(false);
  const [estrategia, setEstrategia] = useState<Estrategia>("postergar");
  const [fimEditadoManualmente, setFimEditadoManualmente] = useState(false);

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const algumFatorConsiderado = considerarFinsDeSemana || considerarFeriados;

  function handleInicioChange(novoInicio: string) {
    setInicio(novoInicio);
    if (!fimEditadoManualmente && novoInicio) {
      setFim(adicionarUmMes(novoInicio));
    }
  }

  function handleFimChange(novoFim: string) {
    setFim(novoFim);
    setFimEditadoManualmente(true);
  }

  function handleLimpar() {
    const iniciais = valoresIniciais();
    setOrcamento(iniciais.orcamento);
    setInicio(iniciais.inicio);
    setFim(iniciais.fim);
    setConsiderarFinsDeSemana(iniciais.considerarFinsDeSemana);
    setConsiderarFeriados(iniciais.considerarFeriados);
    setEstrategia(iniciais.estrategia);
    setFimEditadoManualmente(false);
    setResultado(null);
    setErro(null);
  }

  function paraNumero(valorDigitado: string): number {
    return Number(valorDigitado.replace(",", "."));
  }

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setResultado(null);
    setCarregando(true);

    try {
      const resposta = await fetch("/api/v1/simulacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orcamento: paraNumero(orcamento),
          inicioBruto: inicio,
          fimBruto: fim,
          considerarFinsDeSemana,
          considerarFeriados,
          estrategia,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.error);
        return;
      }

      setResultado(dados);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center gap-3">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            finlog
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Descubra quanto você pode gastar por dia sem estourar o orçamento,
            considerando seu ciclo real de pagamento.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Orçamento (R$)
            </label>
            <input
              value={orcamento}
              onChange={(e) => setOrcamento(e.target.value)}
              placeholder="Ex.: 3000"
              required
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Início do período
              </label>
              <input
                type="date"
                value={inicio}
                onChange={(e) => handleInicioChange(e.target.value)}
                required
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fim do período
              </label>
              <input
                type="date"
                value={fim}
                onChange={(e) => handleFimChange(e.target.value)}
                required
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={considerarFinsDeSemana}
                onChange={(e) => setConsiderarFinsDeSemana(e.target.checked)}
              />
              Considerar finais de semana
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={considerarFeriados}
                onChange={(e) => setConsiderarFeriados(e.target.checked)}
              />
              Considerar feriados
            </label>
          </div>

          {algumFatorConsiderado && (
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {montarRotuloAjuste(considerarFinsDeSemana, considerarFeriados)}
              </p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="estrategia"
                    checked={estrategia === "postergar"}
                    onChange={() => setEstrategia("postergar")}
                  />
                  Adiar para a próxima data válida
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="radio"
                    name="estrategia"
                    checked={estrategia === "antecipar"}
                    onChange={() => setEstrategia("antecipar")}
                  />
                  Antecipar para a data válida anterior
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={carregando}
              className="flex-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md py-2 font-medium hover:bg-slate-800 dark:hover:bg-slate-300 disabled:opacity-50 transition-colors"
            >
              {carregando ? "Calculando..." : "Calcular"}
            </button>
            <button
              type="button"
              onClick={handleLimpar}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Limpar
            </button>
          </div>
        </form>

        {erro && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-md px-3 py-2">
            {erro}
          </p>
        )}

        {resultado && (
          <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {new Date(resultado.inicio).toLocaleDateString("pt-BR")} até{" "}
              {new Date(resultado.fim).toLocaleDateString("pt-BR")} ·{" "}
              {resultado.totalDias} dias
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {resultado.mediaDiaria.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              por dia
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
