(function () {
  "use strict";

  const D = window.XP_DADOS, P = window.PERFIS, M = window.Motor;
  const ASSINATURA = "William Porto · Assessor de Investimentos Private | XP";
  const ORDEM = ["blindagem", "oportunidade", "renda", "elite", "global"];
  const SIGLAS = { blindagem: "B", oportunidade: "O", renda: "R", elite: "E", global: "G" };

  const ABERTURA = {
    blindagem: "Com o resultado da eleição, a bolsa entrou em um período de volatilidade. Em vez de reagir ao ruído, filtramos, a partir do Research XP, as empresas mais preparadas para atravessar os próximos quatro anos: lucro alto e recorrente, balanço forte, receita protegida em dólar ou inflação e baixo risco de interferência.",
    oportunidade: "Momentos de pânico costumam colocar empresas excelentes em preço de liquidação. Selecionamos, a partir do Research XP, companhias de alta qualidade que ficaram mais distantes do preço-alvo. A ideia é montar posição em etapas, sem tentar acertar o fundo.",
    renda: "Para quem vive de renda, o que importa é a regularidade do fluxo. Esta seleção prioriza empresas lucrativas, pouco endividadas e com receitas contratadas, com dividendos projetados acima de 6% ao ano.",
    elite: "Independentemente do ciclo político, algumas empresas seguem entregando rentabilidade acima da média. Esta é a seleção das 10 melhores companhias brasileiras por qualidade de negócio, para quem quer ser sócio das líderes do país.",
    global: "A forma mais eficiente de proteger o patrimônio do risco fiscal é não depender de uma única moeda. Esta carteira combina brasileiras que faturam em dólar com líderes globais acessíveis via BDR.",
  };

  const guardar = {
    ler(k, padrao) { try { const v = localStorage.getItem(k); return v == null ? padrao : JSON.parse(v); } catch (e) { return padrao; } },
    gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* armazenamento indisponível */ } },
  };

  const estado = {
    choque: guardar.ler("wp-choque", 0),
    cotacoes: guardar.ler("wp-cotacoes", { precos: {}, em: null }),
    cliente: "",
    formato: "completa",
    filtros: { busca: "", setor: "", compra: false, semEstatal: false, dolar: false, carteira: false, ordem: "scoreBlindagem", dir: -1 },
  };

  let ativos = [], resultados = {};
  const app = document.getElementById("app");

  // ---------- utilitários ----------
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nf = (v, d = 1) => (v == null || isNaN(v) ? "–" : v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }));
  const pct = (v, d = 1) => (v == null || isNaN(v) ? "–" : nf(v, d) + "%");
  const sinal = (v, d = 0) => (v == null || isNaN(v) ? "–" : (v > 0 ? "+" : "") + nf(v, d) + "%");
  const xis = (v) => (v == null || isNaN(v) ? "–" : nf(v, 1) + "x");
  const moeda = (a) => (a.preco == null ? "–" : (a.moeda === "US$" ? "US$ " : "R$ ") + nf(a.preco, 2));
  const alvo = (a) => (a.alvo == null ? "–" : (a.moeda === "US$" ? "US$ " : "R$ ") + nf(a.alvo, 2));
  const bi = (v) => (v == null ? "–" : "R$ " + nf(v / 1000, 0) + " bi");
  const classeSinal = (v) => (v == null ? "" : v >= 0 ? "pos" : "neg");

  function avisar(texto) {
    const el = document.getElementById("aviso");
    el.textContent = texto;
    el.classList.add("visivel");
    clearTimeout(avisar.t);
    avisar.t = setTimeout(() => el.classList.remove("visivel"), 2400);
  }

  async function copiar(campo) {
    try {
      await navigator.clipboard.writeText(campo.value);
      avisar("Mensagem copiada. É só colar no WhatsApp.");
    } catch (e) {
      campo.focus();
      campo.select();
      const ok = document.execCommand && document.execCommand("copy");
      avisar(ok ? "Mensagem copiada. É só colar no WhatsApp." : "Texto selecionado: use Copiar do seu aparelho.");
    }
  }

  // ---------- cálculo ----------
  function recalcular() {
    ativos = M.preparar(D, P, { choque: estado.choque / 100, cotacoes: estado.cotacoes.precos });
    const b = M.CARTEIRAS[0];
    ativos.forEach((a) => (a.scoreBlindagem = M.pontuar(a, b.pesos, b.cenario)));
    resultados = {};
    M.CARTEIRAS.forEach((def) => (resultados[def.id] = Object.assign({ def }, M.montar(def, ativos))));
    resultados.global = Object.assign({ def: M.GLOBAL }, M.montarGlobal(ativos));
    ativos.forEach((a) => (a.em = ORDEM.filter((id) => resultados[id].ativos.some((x) => x.ticker === a.ticker))));
  }

  const resumo = M.resumo;

  function basePrecos() {
    const n = Object.keys(estado.cotacoes.precos).length;
    const partes = [];
    if (n) partes.push(`${n} cotaç${n === 1 ? "ão atualizada" : "ões atualizadas"}${estado.cotacoes.em ? " em " + new Date(estado.cotacoes.em).toLocaleDateString("pt-BR") : ""}`);
    if (estado.choque) partes.push(`simulação de ${estado.choque}% sobre os preços de ${D.dataBase}${n ? " para as demais" : ""}`);
    if (!partes.length) partes.push(`preços de fechamento de ${D.dataBase}`);
    return partes.join("; ");
  }

  // ---------- etiquetas ----------
  function tags(a) {
    const p = a.perfil, t = [];
    if (a.externo) return '<span class="tag tag--info">BDR · Nasdaq/NYSE</span>';
    if (p.usd === 2) t.push(["pos", "Receita em dólar"]);
    if (p.usd === 1) t.push(["info", "Parte em dólar"]);
    if (p.idx) t.push(["pos", "Receita indexada"]);
    if (p.pp) t.push(["info", "Política pública"]);
    if (p.risco === 3) t.push(["neg", "Estatal: risco de interferência"]);
    if (p.risco === 2) t.push(["warn", "Participação estatal"]);
    if (p.gov) t.push(["neg", "Risco de governança"]);
    if (p.juros === 2) t.push(["neg", "Sensível a juros"]);
    if (a.upside != null && a.upside < 0) t.push(["warn", "Acima do alvo XP"]);
    if (a.moeda === "US$") t.push(["info", "Cotada em US$"]);
    if (a.cotacaoManual) t.push(["info", "Cotação atualizada"]);
    t.push([a.rec === "Compra" ? "pos" : a.rec === "Venda" ? "neg" : "", "XP: " + a.rec]);
    return t.map(([c, txt]) => `<span class="tag${c ? " tag--" + c : ""}">${esc(txt)}</span>`).join("");
  }

  function porque(a) {
    if (a.externo) return "";
    const pil = Object.keys(M.PILARES).map((k) => {
      const v = a.pilares[k] == null ? 0 : a.pilares[k];
      return `<div class="pilar"><span>${M.PILARES[k].nome}</span><i style="--v:${v.toFixed(0)}%"></i><b>${v.toFixed(0)}</b></div>`;
    }).join("");
    const aj = a.cenario.itens.length
      ? `<ul class="ajustes">${a.cenario.itens.map(([r, v]) => `<li><span>${esc(r)}</span><b class="${v >= 0 ? "pos" : "neg"}">${v > 0 ? "+" : ""}${v}</b></li>`).join("")}</ul>`
      : "";
    return `<details class="porque"><summary>Por que esta empresa pontua</summary><div class="pilares">${pil}</div>${aj}</details>`;
  }

  // ---------- página inicial ----------
  function hero() {
    const elegiveis = resultados.blindagem.elegiveis;
    const nCot = Object.keys(estado.cotacoes.precos).length;
    const atalhos = [0, -10, -15, -20, -30]
      .map((v) => `<button class="chip-btn" type="button" data-choque="${v}" aria-pressed="${estado.choque === v}">${v === 0 ? "Sem queda" : v + "%"}</button>`).join("");
    const lista = Object.entries(estado.cotacoes.precos).map(([t, p]) => {
      const base = D.empresas.find((e) => e.ticker === t);
      const v = base && base.preco ? (p / base.preco - 1) * 100 : null;
      return `<span>${esc(t)} ${nf(p, 2)} <b class="${classeSinal(v)}">${sinal(v, 1)}</b></span>`;
    }).join("");

    return `
    <section class="hero">
      <div class="hero__texto">
        <span class="rotulo">Leitura pós-eleição · cenário 2027–2030</span>
        <h1>Volatilidade é preço. <em>Qualidade</em> é o que atravessa o ciclo.</h1>
        <p>O resultado da eleição elevou o prêmio de risco do Brasil. Nesta central, cruzamos a Tabela de Múltiplos do Research XP com um filtro de resiliência para os próximos quatro anos e organizamos carteiras prontas para cada objetivo: proteger, gerar renda, comprar na queda e dolarizar.</p>
        <div class="faixa">
          <span><strong>${D.empresas.length}</strong> empresas analisadas</span>
          <span><strong>${elegiveis}</strong> aprovadas no filtro de Blindagem</span>
          <span>Câmbio implícito <strong>R$ ${nf(M.cambioImplicito(D), 2)}</strong></span>
          <span>Research XP de <strong>${esc(D.dataBase)}</strong></span>
        </div>
        <div class="acoes" style="margin-top:20px"><a class="btn btn--ouro" href="apresentacao.html">Abrir modo apresentação →</a><a class="btn" href="#carteiras">Ver carteiras</a></div>
      </div>
      <aside class="painel" aria-labelledby="painel-titulo">
        <div class="alerta"><span>⚠</span><span><b>Preços-base anteriores ao 2º turno.</b> Atualize as cotações do dia ou simule a queda para recalcular dividendos, P/L, upside e a composição das carteiras. Os preços-alvo da XP podem ser revisados após a eleição.</span></div>
        <h2 id="painel-titulo">Simular queda das ações</h2>
        <p>Aplicado às ações sem cotação atualizada.</p>
        <div class="simulador__topo"><span class="simulador__valor ${estado.choque ? "" : "zero"}" id="choque-valor">${estado.choque}%</span><span class="nota">0% a −35%</span></div>
        <input type="range" id="choque" min="-35" max="0" step="1" value="${estado.choque}" aria-label="Queda simulada em porcentagem">
        <div class="atalhos">${atalhos}</div>
        <hr>
        <h2>Atualizar cotações do dia</h2>
        <p>Cole uma por linha: <code>ITUB4 41,50</code> (aceita planilha e “R$”).</p>
        <textarea id="cotacoes" placeholder="ITUB4 41,50&#10;PRIO3 62,10&#10;VALE3 58,90" style="margin-top:8px"></textarea>
        <div class="acoes">
          <button class="btn btn--ouro" type="button" id="aplicar-cot">Aplicar cotações</button>
          ${nCot ? '<button class="btn btn--fantasma" type="button" id="limpar-cot">Limpar</button>' : ""}
        </div>
        ${nCot ? `<div class="lista-cot">${lista}</div>` : ""}
      </aside>
    </section>`;
  }

  function diretrizes() {
    return `
    <section aria-labelledby="dir-t">
      <div class="secao-cab"><span class="rotulo">Diretrizes</span><h2 class="titulo-secao" id="dir-t">Como posicionar o patrimônio para 2027–2030</h2></div>
      <div class="diretrizes">
        <div class="diretriz" style="--c:var(--pos)"><h3>Priorizar</h3><ul>
          <li>Exportadoras com receita em dólar (proteção contra estresse fiscal e câmbio)</li>
          <li>Bancos privados de alta rentabilidade e seguradoras, que ganham com juros altos</li>
          <li>Contratos corrigidos pela inflação: transmissão, saneamento e telecom</li>
          <li>Empresas com caixa líquido e pouca dependência de crédito</li></ul></div>
        <div class="diretriz" style="--c:var(--neg)"><h3>Reduzir</h3><ul>
          <li>Estatais com histórico de interferência em preços, crédito e dividendos</li>
          <li>Empresas alavancadas em CDI e varejo discricionário</li>
          <li>Small caps sem geração de caixa</li>
          <li>Concentrar 100% do patrimônio em risco Brasil</li></ul></div>
        <div class="diretriz" style="--c:var(--gold)"><h3>Executar</h3><ul>
          <li>Entrar em 3 etapas ao longo de 60 a 90 dias (ex.: 40% · 30% · 30%)</li>
          <li>Rebalancear com disciplina, nunca vender no pânico</li>
          <li>Combinar ações com títulos IPCA+ e dolarização (Global Core 15)</li>
          <li>Revisar as carteiras a cada nova Tabela de Múltiplos da XP</li></ul></div>
      </div>
    </section>`;
  }

  function cardCarteira(id) {
    const r = resultados[id], d = r.def, s = resumo(r);
    const destaque = id === "blindagem";
    const k4 = id === "global"
      ? `<div class="kpi"><dt>Em dólar</dt><dd>${s.dolar}%</dd></div>`
      : `<div class="kpi"><dt>Upside XP</dt><dd class="${classeSinal(s.upside)}">${sinal(s.upside)}</dd></div>`;
    return `
    <article class="card${destaque ? " card--destaque" : ""}">
      <span class="card__selo">${esc(d.selo)}</span>
      <h3><a class="card__link" href="#${id}" style="color:inherit">${esc(d.nome)}</a></h3>
      <p class="card__obj">${esc(d.objetivo)}</p>
      <dl class="kpis">
        <div class="kpi"><dt>Ativos</dt><dd>${r.ativos.length}</dd></div>
        <div class="kpi"><dt>DY 2027${id === "global" ? " (BR)" : ""}</dt><dd>${pct(s.dy)}</dd></div>
        <div class="kpi"><dt>ROE médio${id === "global" ? " (BR)" : ""}</dt><dd>${pct(s.roe, 0)}</dd></div>
        ${k4}
      </dl>
      <div class="tickers">${r.ativos.map((a) => `<span>${esc(a.ticker)}</span>`).join("")}</div>
      <div class="card__rodape"><span>${esc(d.horizonte)} · risco ${esc(d.risco.toLowerCase())}</span><strong>Abrir carteira →</strong></div>
    </article>`;
  }

  function carteiras() {
    return `
    <section id="carteiras" aria-labelledby="cart-t">
      <div class="secao-cab"><span class="rotulo">Carteiras por objetivo</span><h2 class="titulo-secao" id="cart-t">Escolha o objetivo, abra a carteira e envie ao cliente</h2>
      <p class="sub-secao">Cada carteira tem mandato, perfil e filtros próprios. A composição é recalculada automaticamente com os dados do Research XP e com as cotações informadas acima.</p></div>
      <div class="grade">${ORDEM.map(cardCarteira).join("")}</div>
    </section>`;
  }

  function ciclos() {
    return `
    <section aria-labelledby="cic-t">
      <div class="secao-cab"><span class="rotulo">Memória de mercado</span><h2 class="titulo-secao" id="cic-t">O que os ciclos anteriores ensinam</h2></div>
      <div class="ciclos">
        <div class="ciclo"><span class="ciclo__ano">2020 · Pandemia</span><div class="ciclo__num neg">−47%</div><p>Queda do Ibovespa entre janeiro e março. Ainda assim, o índice encerrou 2020 no positivo (+2,9%).</p></div>
        <div class="ciclo"><span class="ciclo__ano">2022–23 · Transição de governo</span><div class="ciclo__num pos">+37%</div><p>Após a eleição de 2022, o índice recuou até cerca de 98 mil pontos em março de 2023 e terminou o ano em 134 mil pontos, recorde à época.</p></div>
        <div class="ciclo ciclo--licao"><span class="ciclo__ano">A lição</span><div class="ciclo__num">Disciplina</div><p>Quem manteve empresas de qualidade e comprou em etapas durante a queda capturou a recuperação. Quem vendeu no pânico transformou oscilação em prejuízo.</p></div>
      </div>
      <p class="nota">Valores aproximados do Ibovespa (pontos de fechamento). Desempenho passado não garante resultado futuro.</p>
    </section>`;
  }

  function filtrar() {
    const f = estado.filtros, q = f.busca.trim().toLowerCase();
    return ativos
      .filter((a) => !q || a.ticker.toLowerCase().includes(q) || a.nome.toLowerCase().includes(q))
      .filter((a) => !f.setor || a.setor === f.setor)
      .filter((a) => !f.compra || a.rec === "Compra")
      .filter((a) => !f.semEstatal || !(a.perfil.risco >= 2))
      .filter((a) => !f.dolar || a.perfil.usd === 2)
      .filter((a) => !f.carteira || a.em.length)
      .sort((x, y) => {
        const vx = x[f.ordem], vy = y[f.ordem];
        if (typeof vx === "string" || typeof vy === "string") return String(vx).localeCompare(String(vy)) * f.dir;
        return ((vx == null ? -Infinity : vx) - (vy == null ? -Infinity : vy)) * f.dir;
      });
  }

  function linhasRanking() {
    const lista = filtrar();
    const corpo = lista.map((a) => {
      const sc = a.scoreBlindagem, cls = sc >= 70 ? "a" : sc >= 55 ? "b" : "c";
      const selos = a.em.map((id) => `<abbr title="${esc(resultados[id].def.nome)}">${SIGLAS[id]}</abbr>`).join("");
      return `<tr>
        <td><span class="tk">${esc(a.ticker)}</span><span class="nm">${esc(a.nome)}</span></td>
        <td>${esc(a.setor)}</td>
        <td><span class="tag${a.rec === "Compra" ? " tag--pos" : a.rec === "Venda" ? " tag--neg" : ""}">${esc(a.rec)}</span></td>
        <td>${moeda(a)}</td>
        <td class="${classeSinal(a.upside)}">${sinal(a.upside)}</td>
        <td>${xis(a.pl27)}</td>
        <td>${pct(a.roe)}</td>
        <td>${pct(a.dy27)}</td>
        <td>${a.financeira ? "n/a" : xis(a.dl26)}</td>
        <td class="${classeSinal(a.cenario.total)}">${a.cenario.total > 0 ? "+" : ""}${a.cenario.total}</td>
        <td><span class="score score--${cls}">${sc.toFixed(0)}</span></td>
        <td><span class="selos">${selos || "–"}</span></td>
      </tr>`;
    }).join("");
    return { corpo, n: lista.length };
  }

  const contagem = (n) => `${n} empresas · ROE = média 2026/27 · Dív/EBITDA de 2026 · ${basePrecos()}`;

  function ranking() {
    const f = estado.filtros;
    const setores = [...new Set(ativos.map((a) => a.setor))].sort();
    const col = (k, rot) => `<th><button type="button" data-ordem="${k}" data-ativo="${f.ordem === k}">${rot}${f.ordem === k ? (f.dir < 0 ? " ↓" : " ↑") : ""}</button></th>`;
    const { corpo, n } = linhasRanking();
    return `
    <section id="filtro" aria-labelledby="fil-t">
      <div class="secao-cab"><span class="rotulo">Filtro completo</span><h2 class="titulo-secao" id="fil-t">Ranking de resiliência 2027–2030</h2>
      <p class="sub-secao">Todas as empresas da cobertura XP com nota de Blindagem (0–100). As letras indicam em quais carteiras a empresa entrou: B Blindagem · O Oportunidade · R Renda · E Elite · G Global.</p></div>
      <div class="filtros">
        <label class="campo">Buscar empresa ou ticker<input type="search" id="f-busca" value="${esc(f.busca)}" placeholder="Ex.: Itaú, PRIO3"></label>
        <label class="campo">Setor<select id="f-setor"><option value="">Todos</option>${setores.map((s) => `<option${s === f.setor ? " selected" : ""}>${esc(s)}</option>`).join("")}</select></label>
        <label class="check"><input type="checkbox" id="f-compra"${f.compra ? " checked" : ""}> Só Compra XP</label>
        <label class="check"><input type="checkbox" id="f-estatal"${f.semEstatal ? " checked" : ""}> Sem estatais</label>
        <label class="check"><input type="checkbox" id="f-dolar"${f.dolar ? " checked" : ""}> Receita em dólar</label>
        <label class="check"><input type="checkbox" id="f-carteira"${f.carteira ? " checked" : ""}> Só em carteiras</label>
      </div>
      <div class="tabela-wrap">
        <table>
          <thead><tr>
            ${col("ticker", "Ativo")}${col("setor", "Setor")}${col("rec", "XP")}${col("preco", "Preço")}${col("upside", "Upside")}${col("pl27", "P/L 27")}${col("roe", "ROE")}${col("dy27", "DY 27")}${col("dl26", "Dív/EBITDA")}<th title="Ajuste de cenário 2027–30">Cenário</th>${col("scoreBlindagem", "Nota")}<th>Carteiras</th>
          </tr></thead>
          <tbody id="ranking-corpo">${corpo}</tbody>
        </table>
      </div>
      <p class="contagem" id="ranking-n">${esc(contagem(n))}</p>
    </section>`;
  }

  function metodologia() {
    const pesos = M.CARTEIRAS.map((d) => `<tr><td>${esc(d.nome)}</td>${Object.keys(M.PILARES).map((k) => `<td>${d.pesos[k]}%</td>`).join("")}<td>×${nf(d.cenario, 1)}</td></tr>`).join("");
    const pilares = Object.values(M.PILARES).map((p) => `<tr><td>${esc(p.nome)}</td><td style="white-space:normal;text-align:left">${esc(p.regra)}</td></tr>`).join("");
    const ajustes = M.AJUSTES.map(([r, v]) => `<tr><td>${esc(r)}</td><td class="${v >= 0 ? "pos" : "neg"}">${v > 0 ? "+" : ""}${v}</td></tr>`).join("");
    return `
    <section id="metodologia" aria-labelledby="met-t">
      <div class="secao-cab"><span class="rotulo">Metodologia</span><h2 class="titulo-secao" id="met-t">Como as carteiras são calculadas</h2>
      <p class="sub-secao">Processo 100% transparente e replicável: os números vêm do Research XP; a camada qualitativa (exposição a dólar, inflação, juros e risco de intervenção) é revisada a cada trimestre.</p></div>
      <div class="metodo">
        <div class="bloco"><h3>Passo a passo</h3><ol class="passos">
          <li><b>Base de dados:</b> Tabela de Múltiplos do Research XP (${D.empresas.length} empresas, dados de ${esc(D.dataBase)}). Excluímos ativos “Sob Revisão” e listagens duplicadas (ADRs e BDRs).</li>
          <li><b>Seis pilares (0–100):</b> qualidade, solidez, renda, preço, escala e crescimento, calculados com as projeções de 2026 e 2027.</li>
          <li><b>Ajuste de cenário 2027–2030:</b> pontos extras para receita em dólar ou indexada e descontos para risco de intervenção, governança e sensibilidade a juros.</li>
          <li><b>Filtros de elegibilidade:</b> cada carteira tem regras mínimas próprias (tamanho, ROE, dívida, dividendos, recomendação).</li>
          <li><b>Seleção e pesos:</b> as maiores notas entram respeitando o limite por setor; os pesos são proporcionais à nota, entre 5% e 15%.</li>
          <li><b>Atualização:</b> quedas simuladas ou cotações informadas recalculam dividend yield, P/L, upside e a composição.</li>
        </ol></div>
        <div class="bloco"><h3>Régua de cada pilar</h3><div class="tabela-wrap" style="border:0"><table class="mini"><tbody>${pilares}</tbody></table></div></div>
        <div class="bloco"><h3>Peso dos pilares por carteira</h3><div class="tabela-wrap" style="border:0"><table class="mini">
          <thead><tr><th>Carteira</th>${Object.values(M.PILARES).map((p) => `<th>${esc(p.nome.slice(0, 5))}.</th>`).join("")}<th>Cenário</th></tr></thead><tbody>${pesos}</tbody></table></div></div>
        <div class="bloco"><h3>Ajuste de cenário 2027–2030 (pontos)</h3><div class="tabela-wrap" style="border:0"><table class="mini"><tbody>${ajustes}</tbody></table></div>
          <p class="nota">Limitações: os preços-alvo e projeções são da XP e podem mudar após a eleição; a classificação qualitativa é uma avaliação própria; os ativos americanos da Global Core 15 são uma seleção qualitativa sem múltiplos nesta base.</p></div>
      </div>
    </section>`;
  }

  function inicio() {
    app.innerHTML = hero() + diretrizes() + carteiras() + ciclos() + ranking() + metodologia();
    document.title = "Central de Carteiras";
  }

  // ---------- detalhe ----------
  function cartaoAtivo(a, i) {
    const metricas = a.externo
      ? `<p class="nota" style="margin:0">Múltiplos no Research Internacional XP.</p>`
      : `<dl class="metricas">
          <div><dt>Preço</dt><dd>${moeda(a)}</dd></div>
          <div><dt>Alvo XP</dt><dd>${alvo(a)}</dd></div>
          <div><dt>Upside</dt><dd class="${classeSinal(a.upside)}">${sinal(a.upside)}</dd></div>
          <div><dt>P/L 2027</dt><dd>${xis(a.pl27)}</dd></div>
          <div><dt>ROE</dt><dd>${pct(a.roe, 0)}</dd></div>
          <div><dt>DY 2027</dt><dd>${pct(a.dy27)}</dd></div>
        </dl>`;
    return `
    <article class="ativo">
      <div class="ativo__topo">
        <span class="ativo__pos">${i + 1}</span>
        <div class="ativo__id"><div class="ativo__ticker">${esc(a.ticker)}</div><div class="ativo__nome">${esc(a.nome)} · ${esc(a.setor)}${a.mcap ? " · " + bi(a.mcap) : ""}</div></div>
        <div class="ativo__peso"><strong>${a.peso}%</strong><small>peso</small></div>
      </div>
      ${metricas}
      ${a.perfil.tese ? `<p class="tese">${esc(a.perfil.tese)}</p>` : ""}
      <div class="tags">${tags(a)}</div>
      ${porque(a)}
    </article>`;
  }

  function setoresBarras(r) {
    const soma = {};
    r.ativos.forEach((a) => (soma[a.setor] = (soma[a.setor] || 0) + a.peso));
    const max = Math.max(...Object.values(soma));
    return Object.entries(soma).sort((x, y) => y[1] - x[1])
      .map(([s, v]) => `<div class="setor-barra"><span title="${esc(s)}">${esc(s)}</span><i style="width:${((v / max) * 100).toFixed(0)}%"></i><b>${v}%</b></div>`).join("");
  }

  function mensagem(r) {
    const d = r.def, s = resumo(r), cliente = estado.cliente.trim();
    const ola = cliente ? `Olá, ${cliente}! Tudo bem?` : "Olá! Tudo bem?";
    const rodape = `_Fonte: Research XP, Tabela de Múltiplos (${D.dataBase}). Indicadores calculados com ${basePrecos()}. Material informativo, não constitui recomendação individual. Avalie a adequação ao seu perfil (suitability). Rentabilidade passada não garante resultado futuro._`;
    const L = [];
    if (estado.formato === "curta") {
      L.push(ola, "", `*${d.nome}* · ${d.horizonte}`, d.objetivo, "");
      r.ativos.forEach((a, i) => L.push(`${i + 1}. *${a.ticker}* (${a.nome}) · ${a.peso}%`));
      L.push("", "Posso te mostrar em 15 minutos como encaixar no seu portfólio?", "", ASSINATURA, "", rodape);
      return L.join("\n");
    }
    L.push(ola, "", ABERTURA[d.id], "", `*${d.nome}*`, `Objetivo: ${d.objetivo}`, `Horizonte: ${d.horizonte} | Risco: ${d.risco}`, "", "*Composição sugerida*");
    r.ativos.forEach((a, i) => {
      L.push(`${i + 1}. *${a.ticker}* · ${a.nome} · ${a.peso}%`);
      if (!a.externo) L.push(`   ROE ${pct(a.roe, 0)} | DY 2027 ${pct(a.dy27)} | P/L ${xis(a.pl27)} | Upside XP ${sinal(a.upside)}`);
      if (a.perfil.tese) L.push(`   ${a.perfil.tese}`);
    });
    L.push("", "*Indicadores médios*" + (d.id === "global" ? " (parte Brasil)" : ""));
    L.push(`DY 2027: ${pct(s.dy)} | ROE: ${pct(s.roe, 0)} | Upside para o alvo XP: ${sinal(s.upside)}` + (s.dolar ? ` | Exposição a dólar: ${s.dolar}%` : ""));
    L.push("", "*Como executar*", "Entrada em 3 etapas ao longo de 60 a 90 dias, sem tentar acertar o fundo. A volatilidade é o preço de entrada; a qualidade das empresas é o que sustenta o resultado no longo prazo.");
    L.push("", "Podemos conversar 15 minutos para ajustar ao seu perfil e definir o tamanho da posição?", "", ASSINATURA, "", rodape);
    return L.join("\n");
  }

  function detalhe(id) {
    const r = resultados[id];
    if (!r) return inicio();
    const d = r.def, s = resumo(r);
    const simulado = estado.choque !== 0;
    app.innerHTML = `
    <a class="voltar" href="#inicio">← Todas as carteiras</a>
    <section class="detalhe">
      <header class="detalhe__cab">
        <span class="card__selo">${esc(d.selo)}</span>
        <h1>${esc(d.nome)}</h1>
        <p>${esc(d.objetivo)}</p>
        <div class="meta"><span>Para quem: <b>${esc(d.paraQuem)}</b></span><span>Horizonte: <b>${esc(d.horizonte)}</b></span><span>Risco: <b>${esc(d.risco)}</b></span>${d.pesosGrupo ? `<span>Alocação: <b>${esc(d.pesosGrupo)}</b></span>` : ""}</div>
      </header>
      <dl class="kpis">
        <div class="kpi"><dt>DY 2027${id === "global" ? " (BR)" : ""}</dt><dd>${pct(s.dy)}</dd></div>
        <div class="kpi"><dt>ROE médio${id === "global" ? " (BR)" : ""}</dt><dd>${pct(s.roe, 0)}</dd></div>
        <div class="kpi"><dt>Upside XP${id === "global" ? " (BR)" : ""}</dt><dd class="${classeSinal(s.upside)}">${sinal(s.upside)}</dd></div>
        <div class="kpi"><dt>Exposição a dólar</dt><dd>${s.dolar}%</dd></div>
      </dl>
      <div class="duas">
        <div class="bloco"><h2>Filtros aplicados</h2><ul class="criterios">${d.criterios.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
          <p class="criterios__resumo">${r.elegiveis} empresas passaram nos filtros${id === "global" ? " brasileiros" : ""}; as maiores notas formam a carteira. Base: ${esc(basePrecos())}.</p></div>
        <div class="bloco"><h2>Alocação por setor</h2>${setoresBarras(r)}</div>
      </div>
      <h2 class="titulo-secao" style="margin-top:28px">Composição</h2>
      <div class="ativos">${r.ativos.map(cartaoAtivo).join("")}</div>
    </section>
    <section class="mensagem" aria-labelledby="msg-t">
      <div class="secao-cab"><span class="rotulo">Pronto para enviar</span><h2 class="titulo-secao" id="msg-t">Mensagem para o cliente</h2></div>
      ${simulado ? `<div class="alerta"><span>⚠</span><span><b>A mensagem usa preços simulados (${estado.choque}%).</b> Antes de enviar, atualize as cotações reais na página inicial ou zere o simulador.</span></div>` : ""}
      <div class="mensagem__grade">
        <div class="bloco">
          <label class="campo">Nome do cliente (opcional)<input type="text" id="m-cliente" value="${esc(estado.cliente)}" placeholder="Ex.: Ricardo"></label>
          <div class="campo" style="margin-top:14px">Formato
            <div class="segmento" role="group" aria-label="Formato da mensagem">
              <button type="button" data-formato="completa" aria-pressed="${estado.formato === "completa"}">Completa</button>
              <button type="button" data-formato="curta" aria-pressed="${estado.formato === "curta"}">Curta</button>
            </div></div>
          <div class="acoes" style="flex-direction:column">
            <button class="btn btn--ouro" type="button" id="m-copiar">Copiar mensagem</button>
            <a class="btn" id="m-whats" href="#" target="_blank" rel="noopener">Abrir no WhatsApp</a>
          </div>
          <p class="nota">Você pode editar o texto ao lado antes de copiar.</p>
        </div>
        <textarea id="m-texto" aria-label="Mensagem para o cliente">${esc(mensagem(r))}</textarea>
      </div>
    </section>`;
    document.title = d.nome + " · Central de Carteiras";
    atualizarWhats();
  }

  function atualizarWhats() {
    const t = document.getElementById("m-texto"), w = document.getElementById("m-whats");
    if (t && w) w.href = "https://wa.me/?text=" + encodeURIComponent(t.value);
  }

  // ---------- cotações ----------
  function lerCotacoes(texto) {
    const validos = new Set(D.empresas.map((e) => e.ticker)), ok = {}, ignorados = [];
    texto.split(/\n+/).forEach((linha) => {
      const m = linha.trim().match(/^([A-Za-z]{2,5}\d{0,2})\s*[:;=\t, ]\s*(?:R\$|US\$)?\s*([\d.,]+)/);
      if (!m) { if (linha.trim()) ignorados.push(linha.trim()); return; }
      const t = m[1].toUpperCase();
      let n = m[2];
      n = n.includes(",") ? n.replace(/\./g, "").replace(",", ".") : n;
      const v = parseFloat(n);
      if (validos.has(t) && v > 0) ok[t] = v;
      else ignorados.push(linha.trim());
    });
    return { ok, ignorados };
  }

  // ---------- roteamento e eventos ----------
  // Âncoras simples (#blindagem, #filtro) para funcionar também em visualizadores que só repassam #token.
  function rota() {
    const id = location.hash.slice(1);
    if (resultados[id]) detalhe(id);
    else inicio();
  }

  function redesenhar() {
    recalcular();
    const y = window.scrollY;
    rota();
    window.scrollTo(0, y);
  }

  app.addEventListener("input", (e) => {
    const t = e.target;
    if (t.id === "choque") {
      const v = document.getElementById("choque-valor");
      v.textContent = t.value + "%";
      v.classList.toggle("zero", t.value === "0");
    } else if (t.id === "f-busca") {
      estado.filtros.busca = t.value;
      const { corpo, n } = linhasRanking();
      document.getElementById("ranking-corpo").innerHTML = corpo;
      document.getElementById("ranking-n").textContent = contagem(n);
    } else if (t.id === "m-cliente") {
      estado.cliente = t.value;
      document.getElementById("m-texto").value = mensagem(resultados[location.hash.slice(1)]);
      atualizarWhats();
    } else if (t.id === "m-texto") {
      atualizarWhats();
    }
  });

  app.addEventListener("change", (e) => {
    const t = e.target, f = estado.filtros;
    if (t.id === "choque") {
      estado.choque = Number(t.value);
      guardar.gravar("wp-choque", estado.choque);
      redesenhar();
      return;
    }
    const mapa ={ "f-setor": ["setor", t.value], "f-compra": ["compra", t.checked], "f-estatal": ["semEstatal", t.checked], "f-dolar": ["dolar", t.checked], "f-carteira": ["carteira", t.checked] };
    if (mapa[t.id]) { f[mapa[t.id][0]] = mapa[t.id][1]; redesenhar(); }
  });

  app.addEventListener("click", (e) => {
    const b = e.target.closest("button, a");
    if (!b) return;
    if (b.dataset.choque != null) {
      estado.choque = Number(b.dataset.choque);
      guardar.gravar("wp-choque", estado.choque);
      redesenhar();
    } else if (b.dataset.ordem) {
      const f = estado.filtros;
      f.dir = f.ordem === b.dataset.ordem ? -f.dir : -1;
      f.ordem = b.dataset.ordem;
      redesenhar();
    } else if (b.id === "aplicar-cot") {
      const { ok, ignorados } = lerCotacoes(document.getElementById("cotacoes").value);
      const n = Object.keys(ok).length;
      if (n) {
        estado.cotacoes = { precos: Object.assign({}, estado.cotacoes.precos, ok), em: new Date().toISOString() };
        guardar.gravar("wp-cotacoes", estado.cotacoes);
        redesenhar();
      }
      avisar(`${n} cotaç${n === 1 ? "ão aplicada" : "ões aplicadas"}${ignorados.length ? ` · ${ignorados.length} linha(s) não reconhecida(s)` : ""}`);
    } else if (b.id === "limpar-cot") {
      estado.cotacoes = { precos: {}, em: null };
      guardar.gravar("wp-cotacoes", estado.cotacoes);
      redesenhar();
      avisar("Cotações removidas. Voltando aos preços-base.");
    } else if (b.dataset.formato) {
      estado.formato = b.dataset.formato;
      redesenhar();
    } else if (b.id === "m-copiar") {
      copiar(document.getElementById("m-texto"));
    }
  });

  window.addEventListener("hashchange", () => {
    rota();
    const secao = document.getElementById(location.hash.slice(1));
    if (secao) secao.scrollIntoView();
    else window.scrollTo(0, 0);
  });
  recalcular();
  rota();
})();
