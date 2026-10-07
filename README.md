<p align="center">
  <img src="src/app/icon.svg" width="72" alt="Logo do finlog" />
</p>

<h1 align="center">finlog</h1>

<p align="center">
  Saiba exatamente quando seu dinheiro entra ou sai da conta, e planeje seu gasto diário ou fluxo de caixa com precisão.
</p>

<p align="center">
  <a href="https://finlog.vercel.app"><strong>Teste agora »</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Licença MIT" />
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript 5" />
</p>

---

## Sumário

- [O problema](#o-problema)
- [Pra quem é](#pra-quem-é)
- [O que faz](#o-que-faz)
- [Construído com](#construído-com)
- [Rodando o projeto](#rodando-o-projeto)
- [Rodando os testes](#rodando-os-testes)
- [Arquitetura](#arquitetura)
- [Roadmap](#roadmap)
- [Licença](#licença)

## O problema

Seu dinheiro tem data pra entrar e data pra sair. O problema é que o calendário não liga pra fim de semana nem feriado.

Um salário "todo dia 5" pode cair num sábado. Uma conta que vence dia 31 simplesmente não existe em fevereiro. E cada situação segue uma regra diferente: CLT antecipa, boleto posterga, cada banco tem sua manha.

O **finlog** resolve isso pra você. Calcula a data real de cada pagamento, considerando os feriados nacionais do Brasil, e te diz exatamente quanto você pode gastar por dia até o próximo recebimento.

## Pra quem é

- **Assalariado**: sabe quanto pode gastar por dia até cair o próximo salário
- **PJ e autônomo**: organiza o caixa em torno de pagamentos e recebimentos que não seguem calendário fixo
- **Empregador**: planeja a folha sabendo quando ela realmente sai
- **Investidor**: calcula prazos entre proventos e obrigações como o DARF

## O que faz

- Calcula feriados nacionais, fixos e móveis (Páscoa, Carnaval, Sexta-feira Santa, Corpus Christi), sem depender de API externa
- Verifica dias úteis pelo calendário bancário brasileiro
- Simula qualquer período entre duas datas, deixando você escolher se fins de semana e feriados contam ou não
- Decide entre antecipar ou postergar o ajuste, porque salário e conta não seguem a mesma regra
- Devolve sua média diária de gasto seguro pro período

## Construído com

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Jest](https://jestjs.io/) + ts-jest, com TDD desde o primeiro commit
- [Tailwind CSS](https://tailwindcss.com/)
- [Podman](https://podman.io/) para o ambiente de desenvolvimento

## Rodando o projeto

Pré-requisito: Podman instalado. Não precisa de Node na máquina.

```bash
git clone https://github.com/mr-jon/finlog.git
cd finlog
podman compose up --build
```

Acesse [http://localhost:3000](http://localhost:3000).

## Rodando os testes

```bash
podman compose exec web npm test
```

Modo watch:

```bash
podman compose exec web npm run test:watch
```

## Arquitetura

MVC adaptado pro Next.js App Router:

- **Model** (`src/models/`): regras de negócio puras, sem dependência de framework, testadas isoladamente com TDD
- **Controller**: Route Handlers (`src/app/api/`)
- **View**: páginas e componentes React (`src/app/`)

## Roadmap

- [x] Cálculo de feriados nacionais e dias úteis
- [x] Simulação de período financeiro entre duas datas
- [ ] Dashboard com projeção dos próximos 12 meses
- [ ] Cadastro de transações recorrentes (salário, aluguel, assinaturas)
- [ ] Categorização de transações
- [ ] Acumular sobra/déficit de um período para o próximo
- [ ] Marcação de previsão → efetivo, com valor real

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.
