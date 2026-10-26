(function () {
  "use strict";

  const D = window.XP_DADOS, P = window.PERFIS, M = window.Motor;
  const ORDEM = ["blindagem", "oportunidade", "renda", "elite", "global"];
  const PERGUNTA = {
    blindagem: "Quero atravessar o mandato com segurança",
    oportunidade: "Quero aproveitar a queda",
    renda: "Quero viver de dividendos",
    elite: "Quero ser sócio das melhores",
    global: "Quero me proteger em dólar",
  };

  const ler = (k, padrao) => { try { const v = localStorage.getItem(k); return v == null ? padrao : JSON.parse(v); } catch (e) { return padrao; } };
  const choque = ler("wp-choque", 0);
  const cotacoes = (ler("wp-cotacoes", { precos: {} }) || {}).precos || {};

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nf = (v, d = 1) => (v == null || isNaN(v) ? "–" : v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }));
  const pct = (v, d = 1) => (v == null || isNaN(v) ? "–" : nf(v, d) + "%");
  const sinal = (v) => (v == null || isNaN(v) ? "–" : (v > 0 ? "+" : "") + nf(v, 0) + "%");

  const ativos = M.preparar(D, P, { choque: choque / 100, cotacoes });
  const R = {};
  M.CARTEIRAS.forEach((def) => (R[def.id] = Object.assign({ def }, M.montar(def, ativos))));
  R.global = Object.assign({ def: M.GLOBAL }, M.montarGlobal(ativos));

  const nCot = Object.keys(cotacoes).length;
  const base = nCot
    ? `${nCot} cotações atualizadas${choque ? `; demais com simulação de ${choque}%` : ""}`
    : choque ? `simulação de ${choque}% sobre ${D.dataBase}` : `preços de ${D.dataBase}, anteriores ao 2º turno`;
  const fonte = `Fonte: Research XP, Tabela de Múltiplos (${esc(D.dataBase)}). Base de preços: ${esc(base)}. Material informativo, não constitui recomendação individual.`;

  function listaPesos(lista, inicio = 0, max = Math.max(...lista.map((a) => a.peso))) {
    return `<ol class="pesos">${lista.map((a, i) => `<li><span class="pos-n">${inicio + i + 1}</span><span class="tk">${esc(a.ticker)}</span><span class="nm">${esc(a.nome)}</span><span class="barra"><i style="width:${((a.peso / max) * 100).toFixed(0)}%"></i></span><b>${a.peso}%</b></li>`).join("")}</ol>`;
  }

  function slideCarteira(id, n) {
    const r = R[id], d = r.def, s = M.resumo(r), g = id === "global";
    const kpis = `
            <div class="kpi"><span>Dividendos 2027${g ? " (BR)" : ""}</span><b>${pct(s.dy)}</b></div>
            <div class="kpi"><span>Rentabilidade (ROE)${g ? " (BR)" : ""}</span><b>${pct(s.roe, 0)}</b></div>
            <div class="kpi"><span>Até o alvo XP${g ? " (BR)" : ""}</span><b class="${s.upside >= 0 ? "pos" : "neg"}">${sinal(s.upside)}</b></div>
            <div class="kpi"><span>Exposição a dólar</span><b>${s.dolar}%</b></div>`;
    const cab = `<div class="s-cab"><span class="eyebrow">Carteira ${n} de 5 · ${esc(d.selo)}</span><h2>${esc(d.nome)}</h2><p class="lead">${esc(d.objetivo)}</p></div>`;
    if (g) {
      const br = r.ativos.filter((a) => !a.externo), eua = r.ativos.filter((a) => a.externo);
      const max = Math.max(...r.ativos.map((a) => a.peso));
      return {
        id,
        html: `${cab}
      <div class="kpis k4">${kpis}</div>
      <div class="grade g-global">
        <div class="bloco lista"><span class="eyebrow">Brasil · receita em dólar · ${br.reduce((x, a) => x + a.peso, 0)}%</span>${listaPesos(br, 0, max)}</div>
        <div class="bloco lista"><span class="eyebrow">Estados Unidos · via BDR · ${eua.reduce((x, a) => x + a.peso, 0)}%</span>${listaPesos(eua, br.length, max)}</div>
      </div>
      <p class="fonte">${fonte} Ativos dos EUA: seleção qualitativa.</p>`,
      };
    }
    return {
      id,
      html: `${cab}
      <div class="grade g-cart">
        <div>
          <div class="kpis">${kpis}</div>
          <div class="meta">
            <span>Para quem: <b>${esc(d.paraQuem)}</b></span>
            <span>Horizonte: <b>${esc(d.horizonte)}</b> · Risco: <b>${esc(d.risco)}</b></span>
          </div>
        </div>
        <div class="bloco lista">${listaPesos(r.ativos)}</div>
      </div>
      <p class="fonte">${fonte}</p>`,
    };
  }

  const slides = [
    {
      id: "capa",
      html: `<div class="pilha">
      <span class="eyebrow">Leitura pós-eleição · Cenário 2027–2030</span>
      <h1>Volatilidade é preço.<br><em>Qualidade</em> é o que atravessa o ciclo.</h1>
      <p class="lead">Como proteger o patrimônio e transformar a correção da bolsa em oportunidade, com carteiras organizadas por objetivo.</p>
      <div class="assin"><span><b>William Porto</b> · Assessor de Investimentos Private | XP</span><span>Base: Research XP de ${esc(D.dataBase)} · ${D.empresas.length} empresas analisadas</span></div></div>`,
    },
    {
      id: "momento",
      html: `
      <div class="s-cab"><span class="eyebrow">O momento</span><h2>O risco subiu. <em>O valor das boas empresas, não.</em></h2></div>
      <div class="grade g3">
        <div class="bloco" style="--c:var(--neg)"><h3><i></i>O que mudou</h3><p>O resultado da eleição elevou o prêmio de risco do Brasil. A bolsa reage primeiro com preço, depois com fundamento.</p></div>
        <div class="bloco" style="--c:var(--pos)"><h3><i></i>O que não mudou</h3><p>Empresas líderes, com lucro alto, balanço forte e receita em dólar ou indexada, seguem gerando caixa em qualquer governo.</p></div>
        <div class="bloco"><h3><i></i>Nossa estratégia</h3><p>Proteger a base, comprar qualidade em etapas durante a queda e manter parte relevante do patrimônio em dólar.</p></div>
      </div>`,
    },
    {
      id: "historia",
      html: `
      <div class="s-cab"><span class="eyebrow">Memória de mercado</span><h2>Quem teve disciplina <em>capturou a recuperação</em>.</h2></div>
      <div class="grade g3">
        <div class="bloco"><span class="eyebrow">2020 · Pandemia</span><div class="num neg" style="margin:10px 0">−47%</div><p>Queda do Ibovespa entre janeiro e março. Ainda assim, o índice fechou 2020 no positivo (+2,9%).</p></div>
        <div class="bloco"><span class="eyebrow">2022–23 · Transição de governo</span><div class="num pos" style="margin:10px 0">+37%</div><p>Do fundo de março de 2023 (cerca de 98 mil pontos) ao recorde de 134 mil pontos no fim daquele ano.</p></div>
        <div class="bloco" style="background:var(--gold-suave);border-color:rgba(212,180,108,.45)"><span class="eyebrow">A lição</span><div class="num ouro" style="margin:10px 0;font-size:clamp(32px,4vw,52px)">Disciplina</div><p style="color:var(--text)">Vender no pânico transforma oscilação em prejuízo. Comprar qualidade em etapas transforma queda em oportunidade.</p></div>
      </div>
      <p class="fonte">Valores aproximados do Ibovespa (pontos de fechamento). Desempenho passado não garante resultado futuro.</p>`,
    },
    {
      id: "diretrizes",
      html: `
      <div class="s-cab"><span class="eyebrow">Diretrizes 2027–2030</span><h2>Onde estar, o que evitar e como entrar.</h2></div>
      <div class="grade g3">
        <div class="bloco" style="--c:var(--pos)"><h3><i></i>Priorizar</h3><ul><li>Exportadoras com receita em dólar</li><li>Bancos privados de alta rentabilidade e seguradoras</li><li>Contratos corrigidos pela inflação: energia, saneamento, telecom</li><li>Empresas com caixa líquido</li></ul></div>
        <div class="bloco" style="--c:var(--neg)"><h3><i></i>Reduzir</h3><ul><li>Estatais com histórico de interferência</li><li>Empresas endividadas em CDI e varejo dependente de crédito</li><li>Small caps sem geração de caixa</li><li>100% do patrimônio em risco Brasil</li></ul></div>
        <div class="bloco"><h3><i></i>Executar</h3><ul><li>Entrar em 3 etapas em 60 a 90 dias</li><li>Rebalancear, nunca vender no pânico</li><li>Combinar ações, IPCA+ e dolarização</li><li>Revisar a cada nova Tabela de Múltiplos da XP</li></ul></div>
      </div>`,
    },
    {
      id: "mapa",
      html: `
      <div class="s-cab"><span class="eyebrow">Carteiras por objetivo</span><h2>Qual é o seu objetivo?</h2><p class="lead">Cinco carteiras, cada uma com mandato, perfil e filtros próprios. Toque para abrir.</p></div>
      <div class="mapa">${ORDEM.map((id) => {
        const r = R[id], s = M.resumo(r);
        return `<a href="#${id}" class="${id === "blindagem" ? "destaque" : ""}"><span class="q">“${esc(PERGUNTA[id])}”</span><strong>${esc(r.def.nome)}</strong><p>${esc(r.def.horizonte)} · risco ${esc(r.def.risco.toLowerCase())}</p><span class="k">${r.ativos.length} ativos · DY <b>${pct(s.dy)}</b></span></a>`;
      }).join("")}</div>`,
    },
    ...ORDEM.map((id, i) => slideCarteira(id, i + 1)),
    {
      id: "execucao",
      html: `
      <div class="s-cab"><span class="eyebrow">Como executar</span><h2>Entrada em etapas, <em>sem tentar acertar o fundo</em>.</h2></div>
      <div class="etapas">
        <div class="etapa"><div class="num">40%</div><h3>Agora</h3><p>Primeira parcela na carteira-base (Blindagem 2027–2030), aproveitando a correção.</p></div>
        <div class="etapa"><div class="num">30%</div><h3>Em 30 a 45 dias</h3><p>Segunda parcela, reforçando os ativos que mais caíram sem mudança de fundamento.</p></div>
        <div class="etapa"><div class="num">30%</div><h3>Em 60 a 90 dias</h3><p>Última parcela e rebalanceamento, com a proteção em dólar ajustada ao seu perfil.</p></div>
      </div>
      <div class="cta"><p>Próximo passo: 15 minutos para ajustar as carteiras ao seu perfil e definir o tamanho de cada posição.</p><a class="btn btn--ouro" href="./#carteiras">Ver carteiras completas →</a></div>`,
    },
    {
      id: "aviso",
      html: `<div class="pilha">
      <div class="s-cab"><span class="eyebrow">Informações importantes</span><h2>Transparência em primeiro lugar.</h2></div>
      <p class="legal">Material informativo elaborado a partir de dados públicos do Research XP (Tabela de Múltiplos de ${esc(D.dataBase)}), sem constituir oferta, recomendação individual ou consultoria de investimentos. Recomendações, preços-alvo e projeções são de responsabilidade dos analistas da XP e podem ser revisados a qualquer momento, inclusive após a eleição. A seleção das carteiras resulta de um filtro quantitativo com premissas qualitativas descritas na metodologia da Central de Carteiras. Ações são investimentos de renda variável, sujeitos a perdas, inclusive do capital investido. Rentabilidade passada não garante resultados futuros. Antes de investir, verifique a adequação do produto ao seu perfil (suitability).</p>
      <div class="assin"><span><b>William Porto</b> · Assessor de Investimentos Private | XP</span></div></div>`,
    },
  ];

  const deck = document.getElementById("deck");
  deck.innerHTML = slides.map((s, i) => `<section class="slide" id="${s.id}" aria-roledescription="slide" aria-label="${i + 1} de ${slides.length}">${s.html}</section>`).join("");
  const els = [...deck.querySelectorAll(".slide")];
  let atual = 0;

  function ir(i, atualizarHash = true) {
    atual = Math.max(0, Math.min(slides.length - 1, i));
    els.forEach((el, k) => {
      el.classList.toggle("ativo", k === atual);
      el.classList.toggle("antes", k < atual);
      if (k === atual) el.scrollTop = 0;
    });
    document.getElementById("contador").textContent = `${atual + 1} / ${slides.length}`;
    document.getElementById("progresso").style.width = ((atual + 1) / slides.length) * 100 + "%";
    document.getElementById("ant").disabled = atual === 0;
    document.getElementById("prox").disabled = atual === slides.length - 1;
    if (atualizarHash) history.replaceState(null, "", "#" + slides[atual].id);
  }

  const indice = (id) => slides.findIndex((s) => s.id === id);
  document.getElementById("ant").addEventListener("click", () => ir(atual - 1));
  document.getElementById("prox").addEventListener("click", () => ir(atual + 1));
  document.getElementById("tela").addEventListener("click", () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => {});
    } catch (e) { /* tela cheia indisponível */ }
  });

  document.addEventListener("keydown", (e) => {
    if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); ir(atual + 1); }
    else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); ir(atual - 1); }
    else if (e.key === "Home") ir(0);
    else if (e.key === "End") ir(slides.length - 1);
  });

  let toque = null;
  deck.addEventListener("touchstart", (e) => { toque = [e.touches[0].clientX, e.touches[0].clientY]; }, { passive: true });
  deck.addEventListener("touchend", (e) => {
    if (!toque) return;
    const dx = e.changedTouches[0].clientX - toque[0], dy = e.changedTouches[0].clientY - toque[1];
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) ir(atual + (dx < 0 ? 1 : -1));
    toque = null;
  });

  deck.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    ir(indice(a.getAttribute("href").slice(1)));
  });

  window.addEventListener("hashchange", () => { const i = indice(location.hash.slice(1)); if (i >= 0 && i !== atual) ir(i, false); });
  const inicial = indice(location.hash.slice(1));
  ir(inicial >= 0 ? inicial : 0, inicial >= 0);
})();
