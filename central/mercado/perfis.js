// Camada qualitativa do Fator Lula 4 (2027–2030). Revisar a cada trimestre.
// usd: receita atrelada ao dólar (0 nenhuma, 1 parcial, 2 majoritária)
// idx: receita contratada e corrigida pela inflação (tarifa, RAP, aluguel, pedágio)
// pp: beneficiária direta de política pública do governo federal
// juros: sensibilidade a juros altos e ao consumo doméstico (0 baixa, 1 média, 2 alta)
// risco: risco de intervenção política/regulatória (0 livre, 1 setor regulado, 2 controle/participação estatal relevante, 3 estatal com histórico de interferência)
// gov: risco de governança do controlador (ex.: controlador muito alavancado)
// sb: solidez de balanço para financeiras (0–100), onde Dív. Líq./EBITDA não se aplica
window.PERFIS = {
  // Agro e alimentos
  TTEN3: { usd: 1, juros: 1, tese: "Insumos e originação de grãos no RS e MT; crescimento consistente com gestão disciplinada." },
  SLCE3: { usd: 2, juros: 1, tese: "Maior produtora listada de grãos e algodão; receita ligada a commodities em dólar." },
  SMTO3: { usd: 2, juros: 1, tese: "Açúcar e etanol de baixo custo, com receita exportadora." },
  ABEV3: { usd: 1, tese: "Líder absoluta em bebidas com caixa líquido, mas com recomendação de Venda da XP." },
  MBRF3: { usd: 2, juros: 1, tese: "BRF + Marfrig: proteínas com forte exposição ao mercado externo." },
  JBS: { usd: 2, juros: 1, tese: "Maior processadora de proteínas do mundo; maior parte da receita fora do Brasil e listagem em Nova York." },
  MDIA3: { juros: 1, tese: "Líder em biscoitos e massas com caixa líquido; consumo básico." },
  BEEF3: { usd: 2, juros: 2, tese: "Exportadora de carne bovina; alto retorno, mas balanço alavancado." },

  // Bancos e instituições financeiras
  ITUB4: { sb: 95, tese: "Banco mais rentável e bem gerido do país: ROE acima de 20% atravessando todos os ciclos (2015–16, 2020, 2022)." },
  BPAC11: { sb: 85, tese: "Maior banco de investimentos da América Latina; ROE ~25% e histórico de ganhar participação em crises." },
  BBDC4: { sb: 70, tese: "Rentabilidade em recuperação, P/L ~7x e dividendos de 6–7% ao ano." },
  SANB11: { sb: 70, tese: "Múltiplo descontado (P/L ~5–6x) e dividendos projetados acima de 10%." },
  BBAS3: { risco: 3, sb: 55, tese: "Estatal: P/VP 0,7x, mas ROE caiu para ~9% com a inadimplência do agro e há risco de uso político do crédito." },
  NU: { sb: 75, juros: 1, tese: "Nubank: plataforma digital com ROE ~27% e expansão para México e Colômbia (cotada em US$)." },
  BMEB4: { sb: 55, tese: "Banco médio com ROE alto (~30%), mas pouca liquidez em bolsa." },
  PINE4: { sb: 50 }, BRBI11: { sb: 65 }, AGBK: { sb: 50, juros: 1 }, PICS: { sb: 50, juros: 1 },
  B3SA3: { sb: 90, risco: 1, tese: "Monopólio da bolsa brasileira; o volume sobe com a volatilidade. A XP vê o preço acima do alvo." },
  CXSE3: { sb: 85, risco: 2, tese: "Seguros e previdência no balcão da Caixa; ROE ~37%, payout alto e ganho com juros altos (float)." },
  SAUD3: { sb: 80, tese: "Seguradora de saúde do grupo Bradesco; caixa líquido e ROE ~24%." },
  PAGS: { sb: 60, juros: 2 }, STNE: { sb: 55, juros: 2 },

  // Bens de capital
  WEGE3: { usd: 2, tese: "Referência global em motores e equipamentos de energia; cerca de metade da receita vem do exterior e o balanço tem caixa líquido." },
  EMBJ3: { usd: 2, tese: "Embraer: receita majoritariamente em dólar (aviação comercial, executiva e defesa) e carteira de pedidos robusta." },
  FRAS3: { usd: 1, tese: "Autopeças com operação internacional crescente." },
  POMO4: { usd: 1, pp: 1, tese: "Marcopolo: líder em ônibus, com exportações e compras de programas públicos." },
  TUPY3: { usd: 2, juros: 1 }, MYPK3: { usd: 2, juros: 1 }, RAPT4: { usd: 1, juros: 1 }, KEPL3: { usd: 1 },

  // Construção civil
  CURY3: { pp: 1, juros: 1, tese: "Líder do Minha Casa Minha Vida em SP e RJ; ROE acima de 80%. O programa tende a seguir prioritário no governo Lula." },
  DIRR3: { pp: 1, juros: 1, tese: "Minha Casa Minha Vida + Riva; ROE ~37% e um dos maiores upsides da cobertura da XP." },
  TEND3: { pp: 1, juros: 1, tese: "Pure player do MCMV em recuperação de margens." },
  PLPL3: { pp: 1, juros: 1 }, MRVE3: { pp: 1, juros: 2 },
  CYRE3: { juros: 2, tese: "Melhor executora da média e alta renda, porém sensível a juros." },
  EZTC3: { juros: 2 }, EVEN3: { juros: 2 }, LAVV3: { juros: 2 }, MELK3: { juros: 2 }, MDNE3: { juros: 2 }, TRIS3: { juros: 2 },

  // Educação
  COGN3: { pp: 1, juros: 2 }, YDUQ3: { pp: 1, juros: 2 }, SEER3: { pp: 1, juros: 2 }, ANIM3: { juros: 2 }, CSED3: { juros: 1 },

  // Elétricas
  AXIA3: { risco: 2, idx: 1, tese: "Ex-Eletrobras: maior geradora e transmissora do país, com dividendos projetados de 11–13%. A União mantém participação relevante." },
  TAEE11: { risco: 1, idx: 1, tese: "Transmissão pura: receita contratada por décadas e corrigida pela inflação; dividendos previsíveis." },
  ISAE4: { risco: 1, idx: 1, tese: "ISA Energia: transmissão com receita (RAP) corrigida pela inflação e dividendos de ~6%." },
  ALUP11: { risco: 1, idx: 1, tese: "Transmissão e geração com receita indexada e lucro em expansão." },
  EGIE3: { risco: 1, idx: 1, tese: "Engie: geração renovável com contratos longos indexados à inflação; ROE ~23%." },
  CPLE3: { risco: 1, idx: 1, tese: "Copel privatizada: ganhos de eficiência e dividendos de 8–11%." },
  CPFE3: { risco: 1, idx: 1, tese: "Distribuição e geração de qualidade, mas com recomendação de Venda da XP." },
  EQTL3: { risco: 1, idx: 1, juros: 1, tese: "Melhor operadora de distribuição do país, porém alavancada (~5x EBITDA)." },
  ENGI11: { risco: 1, idx: 1, juros: 1 }, ENEV3: { risco: 1, juros: 1 }, PASS3: { risco: 1, idx: 1 },
  CMIG4: { risco: 2, idx: 1, tese: "Cemig: estatal mineira com dividendos, mas sujeita a decisões do governo estadual." },
  AURE3: { risco: 1, juros: 2 }, LIGT3: { risco: 1, juros: 2 },

  // Mineração, siderurgia e papel
  VALE3: { usd: 2, risco: 1, tese: "Receita praticamente toda em dólar, P/L ~7x e DY de 6–8%; exposta à China e com histórico de pressão política na sucessão." },
  GGBR4: { usd: 2, tese: "Gerdau: operação relevante nos EUA e balanço sólido." },
  GOAU4: { usd: 2 }, BRAP4: { usd: 2 },
  AURA33: { usd: 2, tese: "Mineradora de ouro: proteção clássica em crise, mas negociada a múltiplos elevados." },
  CMIN3: { usd: 2, gov: 1, tese: "Minério de ferro com receita em dólar, mas controlada pela CSN, um grupo muito alavancado." },
  CBAV3: { usd: 2 }, USIM5: { usd: 1, juros: 1 }, CSNA3: { usd: 1, juros: 2, gov: 1 },
  SUZB3: { usd: 2, tese: "Maior produtora de celulose do mundo, com ~90% da receita em dólar; lucro contábil oscila com o câmbio." },
  KLBN11: { usd: 1, tese: "Papel, embalagens e celulose com parte relevante exportada; ciclo de investimentos maduro." },
  RANI3: { usd: 1 },

  // Shoppings
  MULT3: { idx: 1, juros: 1, tese: "Shoppings de alta renda com aluguéis corrigidos pela inflação." },
  ALOS3: { idx: 1, juros: 1, tese: "Maior plataforma de shoppings do país; DY próximo de 9%." },
  IGTI11: { idx: 1, juros: 1 }, JHSF3: { idx: 1, juros: 1 }, LOGG3: { idx: 1, juros: 1 },

  // Saneamento
  SBSP3: { risco: 1, idx: 1, tese: "Sabesp privatizada: tarifa indexada e lucro projetado em forte alta para 2027." },
  CSMG3: { risco: 2, idx: 1, tese: "Copasa: tarifa indexada e dividendos altos, mas sob controle estadual." },
  SAPR11: { risco: 2, idx: 1 }, ORVR3: { risco: 1, idx: 1 },

  // Saúde
  RDOR3: { juros: 1, tese: "Maior rede hospitalar privada do país, integrada à SulAmérica." },
  HYPE3: { juros: 1 }, FLRY3: { juros: 1 }, DASA3: { juros: 2 }, MATD3: { juros: 1 }, QUAL3: { juros: 2 }, BLAU3: { usd: 1 },

  // TMT
  VIVT3: { risco: 1, tese: "Vivo: líder em telecom, com receita recorrente, balanço quase sem dívida e dividendos crescentes." },
  TIMS3: { risco: 1, tese: "TIM: forte geração de caixa, caixa líquido e DY próximo de 9%." },
  TOTS3: { tese: "Líder em software de gestão (ERP) no Brasil, com receita recorrente e ROE alto." },
  INTB3: { juros: 1 }, LWSA3: { juros: 2 }, POSI3: { juros: 2 }, BMOB3: {}, DESK3: { juros: 1 }, FIQE3: { juros: 1 },

  // Transportes
  MOTV3: { risco: 1, idx: 1, juros: 1, tese: "Motiva (ex-CCR): concessões de rodovias e aeroportos com tarifas indexadas." },
  RAIL3: { risco: 1, usd: 1, juros: 1, tese: "Rumo: ferrovia do agronegócio exportador, em ciclo de investimento." },
  GGPS3: { tese: "GPS: líder em serviços terceirizados, crescendo por aquisições com ROE ~20%." },
  ECOR3: { risco: 1, idx: 1, juros: 1 }, HBSA3: { usd: 1, idx: 1, juros: 1 },
  RENT3: { juros: 2, tese: "Localiza: líder em aluguel de carros, mas alavancada e sensível a juros." },
  MOVI3: { juros: 2 }, VAMO3: { juros: 2 }, SIMH3: { juros: 2 }, MILS3: { juros: 1 }, JSLG3: { juros: 2 }, ARML3: { juros: 2 }, PRNR3: { juros: 1 }, AMOB3: { juros: 2 },

  // Varejo
  RADL3: { tese: "RD Saúde: farmácias (consumo defensivo) com expansão consistente." },
  MELI: { juros: 1, tese: "Mercado Livre: líder de e-commerce e fintech na América Latina (cotada em US$)." },
  ASAI3: { juros: 2 }, SMFT3: { juros: 1 }, LREN3: { juros: 2 }, GMAT3: { juros: 1 }, NATU3: { juros: 2 },
  ALPA4: { usd: 1, juros: 1 }, MGLU3: { juros: 2 }, VIVA3: { juros: 1 }, RIAA3: { juros: 2 }, AZZA3: { juros: 2 },
  VULC3: { juros: 1 }, CEAB3: { juros: 2 }, PGMN3: { juros: 1 }, PNVL3: { juros: 1 }, TFCO4: { juros: 2 },
  AUAU3: { juros: 2 }, SBFG3: { juros: 2 },

  // Óleo, gás e petroquímicos
  PETR4: { usd: 2, risco: 3, tese: "Geração de caixa enorme e DY de 7–8%, mas é o ativo mais exposto a interferência (preços, investimentos e dividendos)." },
  PRIO3: { usd: 2, tese: "Petroleira privada mais eficiente do país: receita em dólar e sem risco de interferência estatal." },
  VBBR3: { juros: 1, tese: "Vibra: maior distribuidora de combustíveis do país, com DY ~7%." },
  UGPA3: { juros: 1 }, CSAN3: { juros: 2 }, BRAV3: { usd: 2, juros: 1 }, RECV3: { usd: 2, juros: 1 },
  UNIP6: { usd: 1 }, BRKM5: { usd: 1, juros: 2 },
};
