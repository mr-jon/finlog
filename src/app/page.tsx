"use client";

import { useState } from "react";

type Resultado = {
  periodo: { inicio: string; fim: string; totalDias: number };
  mediaDiaria: number;
};

export default function Home() {
  const [orcamentoMensal, setOrcamentoMensal] = useState("3000");
  const [ano, setAno] = useState("2026");
  const [mes, setMes] = useState("9");
  const [diaConfigurado, setDiaConfigurado] = useState("31");
  const [estrategia, setEstrategia] = useState("postergar");

  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setResultado(null);
    setCarregando(true);

    try {
      const resposta = await fetch("/api/v1/planejamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orcamentoMensal: Number(orcamentoMensal),
          ano: Number(ano),
          mes: Number(mes),
          diaConfigurado: Number(diaConfigurado),
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
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
          finlog
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Descubra quanto você pode gastar por dia sem estourar o orçamento.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Orçamento mensal (R$)
            </label>
            <input
              value={orcamentoMensal}
              onChange={(e) => setOrcamentoMensal(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Ano
              </label>
              <input
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mês (0-11)
              </label>
              <input
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Dia de pagamento configurado
            </label>
            <input
              value={diaConfigurado}
              onChange={(e) => setDiaConfigurado(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Estratégia
            </label>
            <select
              value={estrategia}
              onChange={(e) => setEstrategia(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
            >
              <option value="postergar">Postergar (boletos)</option>
              <option value="antecipar">Antecipar (salário)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="mt-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-md py-2 font-medium hover:bg-slate-800 dark:hover:bg-slate-300 disabled:opacity-50 transition-colors"
          >
            {carregando ? "Calculando..." : "Calcular"}
          </button>
        </form>

        {erro && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-md px-3 py-2">
            {erro}
          </p>
        )}

        {resultado && (
          <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {new Date(resultado.periodo.inicio).toLocaleDateString("pt-BR")}{" "}
              até {new Date(resultado.periodo.fim).toLocaleDateString("pt-BR")}{" "}
              · {resultado.periodo.totalDias} dias
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
