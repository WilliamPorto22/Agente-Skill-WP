// Biblioteca de ETFs americanos — briefing pocket para cliente leigo.
// Padrão: oque (o que replica/faz), subsetor (foco), expoeA (a que o cliente fica exposto),
// top (principais posições, quando aplicável), taxa (taxa anual) e tese (resumo profissional).
// Use este padrão também para FIIs, fundos e ações: o render do cartão já lê esses campos.
window.ETFS_US = {

  // === Núcleo EUA ===
  VOO: {
    nome: "Vanguard S&P 500",
    classe: "ETF · Ações EUA",
    oque: "Replica o S&P 500 — as 500 maiores empresas listadas nos EUA.",
    subsetor: "Núcleo EUA · diversificado",
    expoeA: "Economia americana como um todo, com peso maior em tecnologia (~30%), saúde (~12%) e serviços financeiros (~13%).",
    top: "Apple, Microsoft, Nvidia, Alphabet, Amazon, Meta.",
    taxa: "0,03% ao ano",
    tese: "Núcleo de qualquer carteira em dólar: baixa taxa, alta liquidez e exposição ampla à bolsa americana.",
  },
  SPY: {
    nome: "SPDR S&P 500",
    classe: "ETF · Ações EUA",
    oque: "Replica o S&P 500 — mesmo índice do VOO, maior volume do mundo.",
    subsetor: "Núcleo EUA · diversificado",
    expoeA: "Mesmas 500 maiores empresas dos EUA; preferido por quem opera com volume e opções.",
    top: "Apple, Microsoft, Nvidia, Alphabet, Amazon, Meta.",
    taxa: "0,09% ao ano",
    tese: "Mesmo índice do VOO, com liquidez superior em opções e trades curtos.",
  },
  IVV: {
    nome: "iShares Core S&P 500",
    classe: "ETF · Ações EUA",
    oque: "Replica o S&P 500 — versão da BlackRock.",
    subsetor: "Núcleo EUA · diversificado",
    expoeA: "Mesmas 500 maiores empresas dos EUA; alternativa ao VOO.",
    taxa: "0,03% ao ano",
    tese: "Alternativa ao VOO com taxa idêntica; útil para diversificar emissor.",
  },
  QQQ: {
    nome: "Invesco QQQ (Nasdaq 100)",
    classe: "ETF · Ações EUA",
    oque: "Replica o Nasdaq 100 — as 100 maiores não-financeiras da Nasdaq.",
    subsetor: "Tecnologia e crescimento",
    expoeA: "Big techs e inovação: tecnologia (~50%), consumo digital, saúde e comunicação. Mais volátil que o S&P 500.",
    top: "Apple, Microsoft, Nvidia, Amazon, Meta, Alphabet, Tesla, Broadcom.",
    taxa: "0,20% ao ano",
    tese: "Exposição concentrada em tecnologia e crescimento; indicado como satélite, não núcleo.",
  },
  SCHD: {
    nome: "Schwab US Dividend Equity",
    classe: "ETF · Ações EUA",
    oque: "Carteira de ~100 empresas americanas que pagam dividendos de forma consistente há mais de 10 anos.",
    subsetor: "Dividendos EUA · qualidade",
    expoeA: "Blue chips maduras com dividendos crescentes: energia, saúde, consumo básico, serviços financeiros e indústria.",
    top: "Verizon, Pepsi, Home Depot, Coca-Cola, Pfizer, Chevron, Lockheed Martin.",
    taxa: "0,06% ao ano",
    tese: "Renda em dólar com viés defensivo e crescimento de dividendos; combina com VOO para equilibrar o núcleo.",
  },
  DGRO: {
    nome: "iShares Core Dividend Growth",
    classe: "ETF · Ações EUA",
    oque: "Ações americanas que elevam dividendos há 5 anos ou mais.",
    subsetor: "Dividendos EUA · crescimento",
    expoeA: "Companhias com histórico de aumento recorrente de dividendos, menos concentrada em energia que o SCHD.",
    taxa: "0,08% ao ano",
    tese: "Complementar ao SCHD, com viés em qualidade e crescimento de proventos.",
  },

  // === Setores EUA ===
  XLK: { nome: "Technology Select Sector", classe: "ETF · Setor EUA", oque: "Setor de tecnologia do S&P 500.", subsetor: "Tecnologia EUA", expoeA: "Software, semicondutores e serviços de TI das maiores empresas americanas.", top: "Apple, Microsoft, Nvidia, Broadcom, Oracle.", taxa: "0,09% ao ano" },
  XLE: { nome: "Energy Select Sector", classe: "ETF · Setor EUA", oque: "Setor de energia do S&P 500.", subsetor: "Energia (óleo e gás) EUA", expoeA: "Exploração, produção e refino de petróleo e gás natural nos EUA.", top: "Exxon, Chevron, ConocoPhillips.", taxa: "0,09% ao ano" },
  XLF: { nome: "Financial Select Sector", classe: "ETF · Setor EUA", oque: "Setor financeiro do S&P 500.", subsetor: "Bancos e seguros EUA", expoeA: "Grandes bancos, seguradoras e gestoras americanas.", top: "Berkshire, JPMorgan, Visa, Mastercard, Bank of America.", taxa: "0,09% ao ano" },
  XLV: { nome: "Health Care Select Sector", classe: "ETF · Setor EUA", oque: "Setor de saúde do S&P 500.", subsetor: "Saúde EUA", expoeA: "Farmacêuticas, planos de saúde, equipamentos médicos e biotecnologia.", top: "Eli Lilly, UnitedHealth, J&J, AbbVie, Merck.", taxa: "0,09% ao ano" },
  XLY: { nome: "Consumer Discretionary", classe: "ETF · Setor EUA", oque: "Setor de consumo discricionário do S&P 500.", subsetor: "Varejo e consumo EUA", expoeA: "Amazon, Tesla, varejistas, hotéis, restaurantes e vestuário.", taxa: "0,09% ao ano" },
  XLP: { nome: "Consumer Staples", classe: "ETF · Setor EUA", oque: "Consumo básico do S&P 500 (defensivo).", subsetor: "Consumo básico EUA", expoeA: "Marcas essenciais do dia a dia: alimentos, bebidas, higiene.", top: "Procter & Gamble, Costco, Coca-Cola, Pepsi, Walmart.", taxa: "0,09% ao ano" },
  XLI: { nome: "Industrial Select Sector", classe: "ETF · Setor EUA", oque: "Setor industrial do S&P 500.", subsetor: "Indústria EUA", expoeA: "Transporte, aeroespacial, defesa e máquinas pesadas.", taxa: "0,09% ao ano" },
  XLU: { nome: "Utilities Select Sector", classe: "ETF · Setor EUA", oque: "Setor de utilities do S&P 500.", subsetor: "Energia elétrica e saneamento EUA", expoeA: "Companhias reguladas com receita estável — defensivo e sensível a juros.", taxa: "0,09% ao ano" },
  XLRE: { nome: "Real Estate Select Sector", classe: "ETF · Setor EUA", oque: "REITs do S&P 500.", subsetor: "Imobiliário EUA (REITs)", expoeA: "Shoppings, logística, torres de telecom, data centers e residencial.", taxa: "0,09% ao ano" },
  SMH: { nome: "VanEck Semiconductors", classe: "ETF · Setor EUA", oque: "25 maiores empresas globais de semicondutores.", subsetor: "Semicondutores global", expoeA: "Nvidia, TSMC, Broadcom, ASML, AMD, Intel — espinha dorsal da IA.", top: "Nvidia, TSMC, Broadcom, ASML.", taxa: "0,35% ao ano" },

  // === Internacional / Mundo ===
  VEA: {
    nome: "Vanguard FTSE Developed Markets",
    classe: "ETF · Ações desenvolvidas ex-EUA",
    oque: "Ações de países desenvolvidos fora dos EUA.",
    subsetor: "Países ricos ex-EUA",
    expoeA: "Europa (Reino Unido, França, Alemanha, Suíça), Japão, Canadá e Austrália. Diversifica o risco EUA.",
    top: "Nestlé, ASML, Novo Nordisk, Toyota, Shell.",
    taxa: "0,06% ao ano",
    tese: "Diversifica geograficamente a parcela em dólar sem perder qualidade.",
  },
  VXUS: { nome: "Vanguard Total International", classe: "ETF · Ações global ex-EUA", oque: "Todas as ações listadas fora dos EUA, desenvolvidas e emergentes.", subsetor: "Mundo ex-EUA", expoeA: "Europa, Japão, China, Índia, Brasil — todo o mundo exceto EUA em um só ativo.", taxa: "0,07% ao ano" },
  VT: { nome: "Vanguard Total World Stock", classe: "ETF · Ações mundo todo", oque: "Mundo inteiro em um só ativo (EUA + ex-EUA).", subsetor: "Mundo global", expoeA: "~60% EUA, ~40% resto do mundo. Núcleo global 1-ticker.", taxa: "0,07% ao ano" },
  IEMG: {
    nome: "iShares Core MSCI Emerging Markets",
    classe: "ETF · Ações emergentes",
    oque: "Replica o MSCI Emerging Markets — ações de países em desenvolvimento.",
    subsetor: "Mercados emergentes",
    expoeA: "China, Taiwan, Índia, Coreia, Brasil, México e África do Sul. Mais volátil, com potencial maior de retorno.",
    top: "TSMC, Tencent, Samsung, Alibaba, Reliance.",
    taxa: "0,09% ao ano",
    tese: "Complemento emergente para quem busca prêmio de crescimento fora do G7.",
  },
  EWZ: { nome: "iShares MSCI Brazil", classe: "ETF · Ações Brasil (US$)", oque: "Principais ações brasileiras cotadas em dólar.", subsetor: "Brasil em dólar", expoeA: "Vale, Petrobras, Itaú, Bradesco, Ambev — jeito simples de comprar Brasil fora da B3.", taxa: "0,57% ao ano" },

  // === Renda fixa EUA ===
  BIL: {
    nome: "SPDR Bloomberg 1-3 Month T-Bill",
    classe: "ETF · Caixa em dólar",
    oque: "Títulos do Tesouro americano de 1 a 3 meses.",
    subsetor: "Caixa em dólar · Treasuries curtíssimos",
    expoeA: "Equivalente ao CDI americano — risco quase zero, rendimento próximo da taxa Fed Funds.",
    taxa: "0,135% ao ano",
    tese: "Caixa estratégico em dólar: liquidez diária, protege do câmbio sem risco de duration.",
  },
  SHV: { nome: "iShares Short Treasury Bond", classe: "ETF · Caixa em dólar", oque: "Treasuries de até 1 ano.", subsetor: "Caixa em dólar · Treasuries curtos", expoeA: "Mesma função do BIL com duration um pouco maior.", taxa: "0,15% ao ano" },
  IEF: {
    nome: "iShares 7-10 Year Treasury",
    classe: "ETF · Renda fixa EUA",
    oque: "Títulos do Tesouro americano de 7 a 10 anos.",
    subsetor: "Tesouro americano médio prazo",
    expoeA: "Juros longos dos EUA — protege em crise (bull flattening) e sobe quando o Fed corta juros.",
    taxa: "0,15% ao ano",
    tese: "Hedge clássico de ciclo: Treasuries sobem quando bolsa cai em recessão.",
  },
  TLT: { nome: "iShares 20+ Year Treasury", classe: "ETF · Renda fixa EUA", oque: "Treasuries de prazo acima de 20 anos.", subsetor: "Tesouro americano longuíssimo", expoeA: "Maior sensibilidade a juros longos — ganhos amplificados quando o Fed corta.", taxa: "0,15% ao ano" },
  AGG: { nome: "iShares Core US Aggregate Bond", classe: "ETF · Renda fixa EUA", oque: "Mercado de renda fixa americano completo (gov + corporate).", subsetor: "Renda fixa EUA diversificada", expoeA: "Combinação de Treasuries, agências e corporate investment grade.", taxa: "0,03% ao ano" },
  LQD: { nome: "iShares iBoxx Investment Grade", classe: "ETF · Renda fixa EUA", oque: "Crédito privado americano grau de investimento.", subsetor: "Crédito privado grau de investimento", expoeA: "Dívida de empresas americanas de alta qualidade (AAA–BBB).", taxa: "0,14% ao ano" },
  HYG: { nome: "iShares iBoxx High Yield", classe: "ETF · Renda fixa EUA", oque: "Crédito high yield (grau especulativo) americano.", subsetor: "Crédito high yield EUA", expoeA: "Dívida de empresas abaixo do grau de investimento — maior cupom, maior risco de crédito.", taxa: "0,49% ao ano" },
  TIP: { nome: "iShares TIPS Bond", classe: "ETF · Renda fixa EUA", oque: "Treasuries corrigidos pela inflação americana (TIPS).", subsetor: "Inflação EUA", expoeA: "Protege o poder de compra em dólar — equivalente ao Tesouro IPCA+ nos EUA.", taxa: "0,19% ao ano" },

  // === Commodities / Proteção ===
  IAU: {
    nome: "iShares Gold Trust",
    classe: "ETF · Ouro físico",
    oque: "Lastro em ouro físico guardado em cofres.",
    subsetor: "Ouro · reserva de valor",
    expoeA: "Movimento do preço do ouro em dólar — reserva de valor clássica em crises monetárias e geopolíticas.",
    taxa: "0,25% ao ano",
    tese: "Hedge de longo prazo contra estresse monetário e desvalorização de moedas fiduciárias.",
  },
  GLD: { nome: "SPDR Gold Shares", classe: "ETF · Ouro físico", oque: "Ouro físico — maior ETF de ouro do mundo.", subsetor: "Ouro · reserva de valor", expoeA: "Mesma exposição do IAU, com liquidez superior em opções.", taxa: "0,40% ao ano" },
  SLV: { nome: "iShares Silver Trust", classe: "ETF · Commodity", oque: "Prata física.", subsetor: "Prata · metal precioso + industrial", expoeA: "Dupla exposição: reserva de valor + demanda industrial (eletrônica, painéis solares).", taxa: "0,50% ao ano" },
  DBC: { nome: "Invesco DB Commodity Index", classe: "ETF · Commodities", oque: "Cesta diversificada de commodities (energia, metais, agro).", subsetor: "Commodities diversificado", expoeA: "Petróleo, gasolina, ouro, trigo, milho, soja — hedge inflacionário amplo.", taxa: "0,87% ao ano" },

  // === Imobiliário / Nichos ===
  VNQ: { nome: "Vanguard Real Estate", classe: "ETF · REITs EUA", oque: "REITs americanos — fundos imobiliários listados nos EUA.", subsetor: "Imobiliário EUA (REITs)", expoeA: "Logística (Prologis), torres de telecom (American Tower), data centers (Equinix), residencial e shopping.", taxa: "0,13% ao ano" },
  REET: { nome: "iShares Global REIT", classe: "ETF · REITs global", oque: "REITs do mundo todo.", subsetor: "Imobiliário global", expoeA: "REITs dos EUA, Europa, Japão, Austrália e Hong Kong.", taxa: "0,14% ao ano" },

  // === Fatores ===
  MTUM: { nome: "iShares MSCI USA Momentum", classe: "ETF · Fator EUA", oque: "Ações americanas com melhor momento de preço.", subsetor: "Fator Momentum", expoeA: "Setor líder do ciclo atual, rotaciona a cada rebalanceamento.", taxa: "0,15% ao ano" },
  QUAL: { nome: "iShares MSCI USA Quality", classe: "ETF · Fator EUA", oque: "Ações de alta qualidade (ROE, baixa alavancagem, lucros estáveis).", subsetor: "Fator Qualidade", expoeA: "Big techs e consumo básico de qualidade superior.", taxa: "0,15% ao ano" },
  USMV: { nome: "iShares MSCI USA Min Vol", classe: "ETF · Fator EUA", oque: "Ações de baixa volatilidade.", subsetor: "Fator Baixa Volatilidade", expoeA: "Defensivos: utilities, saúde, consumo básico. Menor drawdown em crises.", taxa: "0,15% ao ano" },
};
