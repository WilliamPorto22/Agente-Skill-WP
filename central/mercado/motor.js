(function (raiz) {
  // ADRs/BDRs duplicados ou com múltiplos inconsistentes na tabela (mantém a linha principal).
  const DUPLICADOS = new Set(["VALE", "PBR", "PETR3", "MELI34", "ROXO34", "UNIP3", "ALPA3", "PAGS34", "STOC34", "INBR32"]);
  const EM_DOLAR = new Set(["NU", "JBS", "MELI", "PAGS", "STNE"]);
  const FINANCEIRAS = new Set(["Bancos", "Inst. Financeiras"]);

  const PILARES = {
    q: { nome: "Qualidade", regra: "ROE médio 2026/27: 5% = 0 · 25% ou mais = 100" },
    s: { nome: "Solidez", regra: "Dív. Líq./EBITDA 2026: 4x = 0 · caixa líquido = 100. Financeiras: avaliação qualitativa de capital e crédito" },
    r: { nome: "Renda", regra: "Dividend yield 2027: 0% = 0 · 10% ou mais = 100" },
    p: { nome: "Preço", regra: "Média entre upside para o alvo XP (−20% = 0 · +40% = 100) e P/L 2027 (20x = 0 · 6x = 100)" },
    e: { nome: "Escala", regra: "Valor de mercado em escala log: R$ 5 bi = 0 · R$ 150 bi = 100" },
    c: { nome: "Crescimento", regra: "Lucro 2027 vs. 2026: −20% = 0 · +30% = 100" },
  };

  const AJUSTES = [
    ["Receita majoritariamente em dólar", 10, (a) => a.perfil.usd === 2],
    ["Receita parcialmente em dólar", 4, (a) => a.perfil.usd === 1],
    ["Receita indexada à inflação", 5, (a) => a.perfil.idx],
    ["Beneficiada por política pública", 4, (a) => a.perfil.pp],
    ["Recomendação Compra (XP)", 4, (a) => a.rec === "Compra"],
    ["Setor regulado", -2, (a) => a.perfil.risco === 1],
    ["Sensibilidade moderada a juros", -4, (a) => a.perfil.juros === 1],
    ["Controle/participação estatal relevante", -7, (a) => a.perfil.risco === 2],
    ["Risco de governança do controlador", -8, (a) => a.perfil.gov],
    ["Alta sensibilidade a juros/consumo", -10, (a) => a.perfil.juros === 2],
    ["Estatal com histórico de interferência", -15, (a) => a.perfil.risco === 3],
    ["Recomendação Venda (XP)", -15, (a) => a.rec === "Venda"],
  ];

  const lin = (v, a, b) => (v == null || isNaN(v) ? null : Math.max(0, Math.min(100, ((v - a) / (b - a)) * 100)));
  const media = (xs) => { const v = xs.filter((x) => x != null); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };
  const grupo = (setor) => (FINANCEIRAS.has(setor) ? "Financeiro" : setor);

  function fatorCenario(a) {
    const itens = AJUSTES.filter(([, , teste]) => teste(a)).map(([rotulo, pts]) => [rotulo, pts]);
    return { total: itens.reduce((s, [, v]) => s + v, 0), itens };
  }

  // Câmbio implícito na própria tabela: VALE3 (R$) ÷ VALE (US$, 1 ADR = 1 ação).
  function cambioImplicito(dados) {
    const br = dados.empresas.find((e) => e.ticker === "VALE3"), us = dados.empresas.find((e) => e.ticker === "VALE");
    return br && us && br.preco && us.preco ? br.preco / us.preco : 5;
  }

  function preparar(dados, perfis, opcoes) {
    const choque = opcoes.choque || 0, cotacoes = opcoes.cotacoes || {};
    const cambio = cambioImplicito(dados);
    return dados.empresas
      .filter((e) => !DUPLICADOS.has(e.ticker) && e.rec !== "Sob Revisão" && e.preco)
      .map((e) => {
        const manual = cotacoes[e.ticker];
        const preco = manual || e.preco * (1 + choque);
        const f = preco / e.preco;
        const dolar = EM_DOLAR.has(e.ticker);
        const a = {
          ...e,
          perfil: perfis[e.ticker] || {},
          moeda: dolar ? "US$" : "R$",
          financeira: FINANCEIRAS.has(e.setor),
          precoBase: e.preco,
          preco,
          cotacaoManual: !!manual,
          variacao: f - 1,
          upside: e.alvo ? (e.alvo / preco - 1) * 100 : null,
          pl26: e.pl26 != null ? e.pl26 * f : null,
          pl27: e.pl27 != null ? e.pl27 * f : null,
          pvp26: e.pvp26 != null ? e.pvp26 * f : null,
          dy26: e.dy26 != null ? e.dy26 / f : null,
          dy27: e.dy27 != null ? e.dy27 / f : null,
          mcap: e.mcap != null ? e.mcap * f * (dolar ? cambio : 1) : null,
          roe: media([e.roe26, e.roe27]),
          cresc: e.ll26 > 0 && e.ll27 != null ? (e.ll27 / e.ll26 - 1) * 100 : null,
        };
        a.pilares = {
          q: lin(a.roe, 5, 25) ?? 0,
          s: a.financeira ? a.perfil.sb ?? 55 : a.dl26 == null ? 50 : lin(-a.dl26, -4, 0),
          r: lin(a.dy27, 0, 10) ?? 0,
          p: media([lin(a.upside, -20, 40), a.pl27 > 0 ? lin(-a.pl27, -20, -6) : 0]) ?? 0,
          e: a.mcap ? lin(Math.log10(a.mcap), Math.log10(5000), Math.log10(150000)) : 0,
          c: lin(a.cresc, -20, 30) ?? 50,
        };
        a.cenario = fatorCenario(a);
        return a;
      });
  }

  function pontuar(a, pesos, multCenario) {
    const base = Object.keys(pesos).reduce((s, k) => s + (pesos[k] * a.pilares[k]) / 100, 0);
    return Math.max(0, Math.min(100, base + a.cenario.total * multCenario));
  }

  // Pesos proporcionais ao score, limitados entre 5% e 15%, arredondados para somar 100%.
  function pesar(itens) {
    let w = itens.map((i) => Math.max(i.score - 35, 5));
    for (let k = 0; k < 20; k++) {
      const s = w.reduce((x, y) => x + y, 0);
      w = w.map((x) => Math.min(0.15, Math.max(0.05, x / s)));
    }
    const s = w.reduce((x, y) => x + y, 0);
    const brutos = w.map((x) => (x / s) * 100);
    const inteiros = brutos.map(Math.floor);
    let falta = 100 - inteiros.reduce((x, y) => x + y, 0);
    brutos.map((b, i) => [b - inteiros[i], i]).sort((x, y) => y[0] - x[0]).forEach(([, i]) => { if (falta-- > 0) inteiros[i]++; });
    return inteiros;
  }

  function montar(def, ativos) {
    const ordenados = ativos
      .filter(def.elegivel)
      .map((a) => ({ ...a, score: pontuar(a, def.pesos, def.cenario) }))
      .sort((x, y) => y.score - x.score);
    const cont = {}, sel = [];
    for (const a of ordenados) {
      const g = grupo(a.setor), lim = g === "Financeiro" ? def.maxFin : def.maxSetor;
      if ((cont[g] || 0) >= lim) continue;
      cont[g] = (cont[g] || 0) + 1;
      sel.push(a);
      if (sel.length === def.n) break;
    }
    const pesos = pesar(sel);
    sel.forEach((a, i) => (a.peso = pesos[i]));
    return { ativos: sel, elegiveis: ordenados.length };
  }

  // Receita contratada e indexada suporta mais dívida: tolerância +1x EBITDA.
  const dl = (a, max) => a.financeira || a.dl26 == null || a.dl26 <= max + (a.perfil.idx ? 1 : 0);
  const juros = (a) => a.perfil.juros || 0;
  const risco = (a) => a.perfil.risco || 0;
  const plOk = (a, max) => a.pl27 == null || (a.pl27 > 0 && a.pl27 <= max);

  const CARTEIRAS = [
    {
      id: "blindagem",
      nome: "Blindagem 2027–2030",
      selo: "Nova · prioridade",
      objetivo: "Empresas preparadas para atravessar os quatro anos do novo mandato: lucro alto e recorrente, balanço forte, receita protegida (dólar ou inflação) e baixo risco de interferência.",
      paraQuem: "Base da carteira de ações de qualquer cliente que quer ficar exposto à bolsa brasileira com segurança.",
      horizonte: "4 anos (2027–2030)",
      risco: "Moderado",
      n: 10, maxSetor: 2, maxFin: 3,
      pesos: { q: 30, s: 25, r: 15, p: 10, e: 15, c: 5 }, cenario: 1,
      criterios: ["Valor de mercado ≥ R$ 15 bi", "ROE médio 2026/27 ≥ 12%", "Dív. Líq./EBITDA ≤ 3,5x (4,5x se receita indexada)", "P/L 2027 ≤ 30x", "Preço até 10% acima do alvo XP", "Sem alta sensibilidade a juros", "Exclui estatais com histórico de interferência e riscos de governança", "Sem recomendação de Venda", "Máx. 2 por setor (3 no financeiro)"],
      elegivel: (a) => a.mcap >= 15000 && a.roe >= 12 && dl(a, 3.5) && plOk(a, 30) && a.upside >= -10 && juros(a) < 2 && risco(a) < 3 && !a.perfil.gov && a.rec !== "Venda",
    },
    {
      id: "oportunidade",
      nome: "Ciclo de Oportunidade",
      selo: "Compra na queda",
      objetivo: "Empresas de alta qualidade que o pânico deixou mais baratas: maior distância para o preço-alvo da XP e menor P/L, sem abrir mão de balanço sólido.",
      paraQuem: "Cliente com liquidez disponível que quer aproveitar a correção para montar posição em etapas.",
      horizonte: "24 a 36 meses",
      risco: "Moderado a arrojado",
      n: 8, maxSetor: 2, maxFin: 2,
      pesos: { q: 25, s: 20, r: 10, p: 35, e: 5, c: 5 }, cenario: 0.6,
      criterios: ["Recomendação Compra da XP", "Upside para o alvo XP > 5%", "ROE médio ≥ 15%", "Valor de mercado ≥ R$ 10 bi", "Dív. Líq./EBITDA ≤ 3x (4x se receita indexada)", "P/L 2027 ≤ 30x", "Sem alta sensibilidade a juros", "Exclui estatais com histórico de interferência e riscos de governança"],
      elegivel: (a) => a.rec === "Compra" && a.upside > 5 && a.roe >= 15 && a.mcap >= 10000 && dl(a, 3) && plOk(a, 30) && juros(a) < 2 && risco(a) < 3 && !a.perfil.gov,
    },
    {
      id: "renda",
      nome: "Renda Private",
      selo: "Dividendos",
      objetivo: "Fluxo de dividendos acima de 6% ao ano pago por empresas lucrativas e pouco alavancadas, priorizando receitas contratadas.",
      paraQuem: "Cliente que busca renda passiva recorrente e previsibilidade (planejamento de aposentadoria e sucessão).",
      horizonte: "5 anos ou mais",
      risco: "Moderado",
      n: 10, maxSetor: 3, maxFin: 3,
      pesos: { q: 20, s: 20, r: 40, p: 10, e: 5, c: 5 }, cenario: 0.6,
      criterios: ["DY projetado 2027 ≥ 6%", "DY 2026 ≥ 3,5% (consistência)", "ROE médio ≥ 12%", "Valor de mercado ≥ R$ 8 bi", "Dív. Líq./EBITDA ≤ 4x (5x se receita indexada)", "Exclui estatais com histórico de interferência e riscos de governança", "Máx. 3 por setor"],
      elegivel: (a) => a.dy27 >= 6 && a.dy26 >= 3.5 && a.roe >= 12 && a.mcap >= 8000 && dl(a, 4) && juros(a) < 2 && risco(a) < 3 && !a.perfil.gov && a.rec !== "Venda",
    },
    {
      id: "elite",
      nome: "Brasil Elite 10",
      selo: "Qualidade",
      objetivo: "As 10 melhores empresas brasileiras por qualidade de negócio — rentabilidade, solidez, escala e crescimento —, independentemente do preço de hoje.",
      paraQuem: "Núcleo de longo prazo para quem quer ser sócio das empresas líderes do país.",
      horizonte: "5 a 7 anos",
      risco: "Moderado",
      n: 10, maxSetor: 2, maxFin: 3,
      pesos: { q: 40, s: 25, r: 5, p: 0, e: 20, c: 10 }, cenario: 0.5,
      criterios: ["Valor de mercado ≥ R$ 20 bi", "ROE médio ≥ 15%", "Dív. Líq./EBITDA ≤ 3x (4x se receita indexada)", "P/L 2027 ≤ 30x", "Sem recomendação de Venda", "Exclui estatais com histórico de interferência e riscos de governança", "Máx. 2 por setor (3 no financeiro)"],
      elegivel: (a) => a.mcap >= 20000 && a.roe >= 15 && dl(a, 3) && plOk(a, 30) && risco(a) < 3 && !a.perfil.gov && a.rec !== "Venda",
    },
  ];

  const GLOBAL_EUA = [
    ["MSFT34", "Microsoft", "Nuvem (Azure) e software corporativo, com liderança em IA aplicada a empresas."],
    ["GOGL34", "Alphabet (Google)", "Busca, YouTube e Google Cloud, com geração de caixa gigantesca."],
    ["AMZO34", "Amazon", "E-commerce e AWS, a maior plataforma de nuvem do mundo."],
    ["AAPL34", "Apple", "Ecossistema com mais de 2 bilhões de dispositivos ativos e recompras recorrentes."],
    ["NVDC34", "Nvidia", "Infraestrutura de IA: chips e software dominantes em data centers."],
    ["M1TA34", "Meta", "Facebook, Instagram e WhatsApp, com mais de 3 bilhões de usuários diários."],
    ["BERK34", "Berkshire Hathaway", "Conglomerado de Warren Buffett: seguros, ferrovia e energia, com caixa elevado."],
    ["VISA34", "Visa", "Pedágio sobre pagamentos digitais no mundo, com margens acima de 50%."],
    ["JPMC34", "JPMorgan", "Maior banco dos EUA e referência em gestão de risco."],
    ["LILY34", "Eli Lilly", "Líder em tratamentos para obesidade e diabetes."],
  ];

  const elegivelGlobal = (a) =>
    a.perfil.usd === 2 && a.mcap >= 15000 && dl(a, 3.5) && plOk(a, 30) && risco(a) < 3 && !a.perfil.gov && a.rec !== "Venda";

  function montarGlobal(ativos) {
    const blind = CARTEIRAS[0];
    const br = ativos
      .filter(elegivelGlobal)
      .map((a) => ({ ...a, score: pontuar(a, blind.pesos, blind.cenario) }))
      .sort((x, y) => y.score - x.score);
    const cont = {}, sel = [];
    for (const a of br) {
      if ((cont[a.setor] || 0) >= 2) continue;
      cont[a.setor] = (cont[a.setor] || 0) + 1;
      sel.push({ ...a, peso: 6 });
      if (sel.length === 5) break;
    }
    const eua = GLOBAL_EUA.map(([ticker, nome, tese]) => ({ ticker, nome, setor: "EUA (BDR)", peso: 7, externo: true, perfil: { tese } }));
    return { ativos: sel.concat(eua), elegiveis: br.length };
  }

  const GLOBAL = {
    id: "global",
    nome: "Global Core 15",
    selo: "Proteção em dólar",
    objetivo: "As 15 empresas que formam o núcleo global: 5 brasileiras com receita em dólar + 10 líderes americanas via BDR. É a principal defesa contra estresse fiscal e câmbio.",
    paraQuem: "Patrimônio consolidado que quer reduzir a dependência do risco Brasil sem sair da plataforma.",
    horizonte: "7 a 10 anos",
    risco: "Moderado",
    pesosGrupo: "Brasil 30% · EUA 70%",
    criterios: ["Brasil: receita majoritariamente em dólar", "Brasil: valor de mercado ≥ R$ 15 bi, Dív. Líq./EBITDA ≤ 3,5x, P/L 2027 ≤ 30x", "Brasil: sem estatais com histórico de interferência e sem Venda XP", "Brasil: as 5 maiores notas da Blindagem, máx. 2 por setor", "EUA: líderes globais de qualidade (seleção qualitativa)", "Múltiplos dos EUA não constam da tabela XP: consultar o Research Internacional"],
  };

  const api = { preparar, montar, montarGlobal, pontuar, cambioImplicito, CARTEIRAS, GLOBAL, PILARES, AJUSTES, grupo };
  if (typeof module !== "undefined") module.exports = api;
  else raiz.Motor = api;
})(this);
