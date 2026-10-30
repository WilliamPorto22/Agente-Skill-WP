// Camada qualitativa do Fator Lula 4 (2027–2030). Revisar a cada trimestre.
// usd: receita atrelada ao dólar (0 nenhuma, 1 parcial, 2 majoritária)
// idx: receita contratada e corrigida pela inflação (tarifa, RAP, aluguel, pedágio)
// pp: beneficiária direta de política pública do governo federal
// juros: sensibilidade a juros altos e ao consumo doméstico (0 baixa, 1 média, 2 alta)
// risco: risco de intervenção política/regulatória (0 livre, 1 setor regulado, 2 controle/participação estatal relevante, 3 estatal com histórico de interferência)
// gov: risco de governança do controlador (ex.: controlador muito alavancado)
// sb: solidez de balanço para financeiras (0–100), onde Dív. Líq./EBITDA não se aplica
// --- Briefing pocket para cliente leigo ---
// oque: em uma linha, o que a empresa faz (sem jargão)
// subsetor: nicho específico dentro do setor (ex.: "Grãos e algodão", "Bancos privados grandes")
// expoeA: a que o cliente fica exposto comprando esta ação (demanda, moeda, ciclo)
window.PERFIS = {
  // Agro e alimentos
  TTEN3: { usd: 1, juros: 1, oque: "Vende insumos agrícolas (fertilizantes, defensivos) e compra grãos de produtores no RS e MT.", subsetor: "Insumos agrícolas e originação de grãos", expoeA: "Safra brasileira e preço de grãos; parte da margem em dólar.", tese: "Insumos e originação de grãos no RS e MT; crescimento consistente com gestão disciplinada." },
  SLCE3: { usd: 2, juros: 1, oque: "Maior fazenda listada do país: cultiva soja, milho e algodão em larga escala.", subsetor: "Grãos e algodão (fazendas próprias)", expoeA: "Preço internacional das commodities agrícolas, em dólar.", tese: "Maior produtora listada de grãos e algodão; receita ligada a commodities em dólar." },
  SMTO3: { usd: 2, juros: 1, oque: "Produz açúcar e etanol a partir da cana — uma das usinas de menor custo do Brasil.", subsetor: "Sucroenergético (açúcar + etanol)", expoeA: "Preço do açúcar no mercado internacional (US$) e preço do etanol no Brasil.", tese: "Açúcar e etanol de baixo custo, com receita exportadora." },
  ABEV3: { usd: 1, oque: "Dona de Skol, Brahma, Antarctica, Budweiser, Corona, Guaraná Antarctica e Stella.", subsetor: "Cervejas e refrigerantes", expoeA: "Consumo de bebidas na América Latina; parte da receita no Canadá e Caribe.", tese: "Líder absoluta em bebidas com caixa líquido, mas com recomendação de Venda da XP." },
  MBRF3: { usd: 2, juros: 1, oque: "Fusão BRF + Marfrig: dona das marcas Sadia, Perdigão, Qualy e líder em carne bovina.", subsetor: "Proteínas (frango, suíno, bovino)", expoeA: "Exportação de carnes para China, Oriente Médio e EUA; moeda forte.", tese: "BRF + Marfrig: proteínas com forte exposição ao mercado externo." },
  JBS: { usd: 2, juros: 1, oque: "Maior frigorífico do mundo: processa carne bovina, suína, frango e peixe.", subsetor: "Proteínas global (operações nos EUA, Brasil, Austrália e Europa)", expoeA: "Consumo global de carne; a maior parte da receita é em dólar, listada em NY.", tese: "Maior processadora de proteínas do mundo; maior parte da receita fora do Brasil e listagem em Nova York." },
  MDIA3: { juros: 1, oque: "M. Dias Branco: fabrica Vitarella, Richester, Fortaleza, Adria e Zabet (biscoitos e massas).", subsetor: "Alimentos — biscoitos e massas", expoeA: "Consumo essencial no Brasil; defensivo contra ciclos.", tese: "Líder em biscoitos e massas com caixa líquido; consumo básico." },
  BEEF3: { usd: 2, juros: 2, oque: "Minerva Foods: foca em carne bovina para exportação, maior exportadora da América do Sul.", subsetor: "Carne bovina exportação", expoeA: "Demanda chinesa e árabe por carne bovina; receita em dólar.", tese: "Exportadora de carne bovina; alto retorno, mas balanço alavancado." },

  // Bancos e instituições financeiras
  ITUB4: { sb: 95, oque: "Maior banco privado do Brasil: crédito, cartões, Itaú BBA e Itaú Asset.", subsetor: "Banco privado grande (pessoa física + atacado)", expoeA: "Crédito ao brasileiro e à grande empresa; ganha com juros altos (NII) e spreads.", tese: "Banco mais rentável e bem gerido do país: ROE acima de 20% atravessando todos os ciclos (2015–16, 2020, 2022)." },
  BPAC11: { sb: 85, oque: "BTG Pactual: maior banco de investimentos da América Latina (M&A, mercado de capitais, wealth, asset).", subsetor: "Banco de investimento e gestão de patrimônio", expoeA: "Volume de operações do mercado de capitais e ciclo de M&A; ganha participação em crises.", tese: "Maior banco de investimentos da América Latina; ROE ~25% e histórico de ganhar participação em crises." },
  BBDC4: { sb: 70, oque: "Segundo maior banco privado do país: forte em crédito pessoa física, cartões e Bradesco Seguros.", subsetor: "Banco privado grande", expoeA: "Crédito ao brasileiro e carteira de seguros; sensível à inadimplência.", tese: "Rentabilidade em recuperação, P/L ~7x e dividendos de 6–7% ao ano." },
  SANB11: { sb: 70, oque: "Santander Brasil: braço local do grupo espanhol, com foco em pessoa física e PME.", subsetor: "Banco privado grande", expoeA: "Crédito ao brasileiro; parte dos dividendos vai para a matriz na Espanha.", tese: "Múltiplo descontado (P/L ~5–6x) e dividendos projetados acima de 10%." },
  BBAS3: { risco: 3, sb: 55, oque: "Banco do Brasil: maior credor do agronegócio e do funcionalismo público.", subsetor: "Banco estatal (controle federal)", expoeA: "Safra agrícola, folha do governo e decisões políticas sobre crédito e dividendos.", tese: "Estatal: P/VP 0,7x, mas ROE caiu para ~9% com a inadimplência do agro e há risco de uso político do crédito." },
  NU: { sb: 75, juros: 1, oque: "Nubank: banco digital com conta, cartão de crédito, investimentos e crédito pessoal.", subsetor: "Banco digital (fintech)", expoeA: "Crédito ao brasileiro de baixa e média renda, com expansão para México e Colômbia; cotado em US$.", tese: "Nubank: plataforma digital com ROE ~27% e expansão para México e Colômbia (cotada em US$)." },
  BMEB4: { sb: 55, oque: "Banco Mercantil do Brasil: foco em consignado para aposentados do INSS.", subsetor: "Banco médio especializado em consignado", expoeA: "Carteira de consignado — baixo risco de crédito, mas pouco volume na bolsa.", tese: "Banco médio com ROE alto (~30%), mas pouca liquidez em bolsa." },
  PINE4: { sb: 50 }, BRBI11: { sb: 65 }, AGBK: { sb: 50, juros: 1 }, PICS: { sb: 50, juros: 1 },
  B3SA3: { sb: 90, risco: 1, oque: "A B3 é a bolsa de valores do Brasil: ganha taxa em cada compra, venda e liquidação de ação, futuro ou derivativo.", subsetor: "Infraestrutura de mercado (monopólio)", expoeA: "Volume negociado na bolsa — aumenta em alta volatilidade.", tese: "Monopólio da bolsa brasileira; o volume sobe com a volatilidade. A XP vê o preço acima do alvo." },
  CXSE3: { sb: 85, risco: 2, oque: "Caixa Seguridade: vende seguros, previdência e capitalização nas agências da Caixa Econômica.", subsetor: "Seguros e previdência (canal bancário)", expoeA: "Clientes da Caixa; ganha float com juros altos.", tese: "Seguros e previdência no balcão da Caixa; ROE ~37%, payout alto e ganho com juros altos (float)." },
  SAUD3: { sb: 80, oque: "Bradesco Saúde + Odontoprev: planos de saúde e odontológicos corporativos.", subsetor: "Seguros de saúde", expoeA: "Mercado de planos de saúde empresariais no Brasil.", tese: "Seguradora de saúde do grupo Bradesco; caixa líquido e ROE ~24%." },
  PAGS: { sb: 60, juros: 2 }, STNE: { sb: 55, juros: 2 },

  // Bens de capital
  WEGE3: { usd: 2, oque: "WEG: fabrica motores elétricos, geradores, transformadores e sistemas de automação industrial.", subsetor: "Bens de capital — eletrificação e energia", expoeA: "Investimento global em infraestrutura elétrica, data centers e transição energética; receita em dólar.", tese: "Referência global em motores e equipamentos de energia; cerca de metade da receita vem do exterior e o balanço tem caixa líquido." },
  EMBJ3: { usd: 2, oque: "Embraer: fabrica aviões comerciais (E175, E195), executivos (Phenom, Praetor) e de defesa (KC-390, Super Tucano).", subsetor: "Aeronáutica", expoeA: "Pedidos de companhias aéreas e governos; receita quase toda em dólar.", tese: "Embraer: receita majoritariamente em dólar (aviação comercial, executiva e defesa) e carteira de pedidos robusta." },
  FRAS3: { usd: 1, oque: "Fras-le: autopeças (freios, suspensão) com operações no Brasil, EUA, Argentina e China.", subsetor: "Autopeças", expoeA: "Mercado de reposição global; receita parcial em dólar.", tese: "Autopeças com operação internacional crescente." },
  POMO4: { usd: 1, pp: 1, oque: "Marcopolo: fabrica carrocerias de ônibus urbanos, rodoviários e escolares.", subsetor: "Ônibus e transporte coletivo", expoeA: "Programas de renovação de frota (Caminho da Escola, Pró-Transporte) e exportação.", tese: "Marcopolo: líder em ônibus, com exportações e compras de programas públicos." },
  TUPY3: { usd: 2, juros: 1 }, MYPK3: { usd: 2, juros: 1 }, RAPT4: { usd: 1, juros: 1 }, KEPL3: { usd: 1 },

  // Construção civil
  CURY3: { pp: 1, juros: 1, oque: "Cury: constrói e vende apartamentos do Minha Casa Minha Vida em SP e RJ.", subsetor: "Construção civil — baixa renda (MCMV)", expoeA: "Volume do MCMV e crédito habitacional via Caixa; defendido pelo governo Lula.", tese: "Líder do Minha Casa Minha Vida em SP e RJ; ROE acima de 80%. O programa tende a seguir prioritário no governo Lula." },
  DIRR3: { pp: 1, juros: 1, oque: "Direcional: constrói para o MCMV (segmento econômico) e Riva (média renda).", subsetor: "Construção civil — baixa e média renda", expoeA: "MCMV e demanda de média renda; crédito via Caixa.", tese: "Minha Casa Minha Vida + Riva; ROE ~37% e um dos maiores upsides da cobertura da XP." },
  TEND3: { pp: 1, juros: 1, oque: "Tenda: pure player do MCMV — faixas 1 a 3 com forte presença em SP.", subsetor: "Construção civil — baixa renda (MCMV)", expoeA: "Programa MCMV e crédito habitacional popular.", tese: "Pure player do MCMV em recuperação de margens." },
  PLPL3: { pp: 1, juros: 1 }, MRVE3: { pp: 1, juros: 2 },
  CYRE3: { juros: 2, oque: "Cyrela: constrói e vende apartamentos de média e alta renda, principalmente em SP.", subsetor: "Construção civil — média e alta renda", expoeA: "Vendas de imóveis em SP; muito sensível à Selic (crédito imobiliário).", tese: "Melhor executora da média e alta renda, porém sensível a juros." },
  EZTC3: { juros: 2 }, EVEN3: { juros: 2 }, LAVV3: { juros: 2 }, MELK3: { juros: 2 }, MDNE3: { juros: 2 }, TRIS3: { juros: 2 },

  // Educação
  COGN3: { pp: 1, juros: 2 }, YDUQ3: { pp: 1, juros: 2 }, SEER3: { pp: 1, juros: 2 }, ANIM3: { juros: 2 }, CSED3: { juros: 1 },

  // Elétricas
  AXIA3: { risco: 2, idx: 1, oque: "Ex-Eletrobras: maior geradora (hidrelétricas) e transmissora do Brasil.", subsetor: "Energia elétrica — geração e transmissão", expoeA: "Despacho de hidrelétricas e tarifas de transmissão (indexadas à inflação); União mantém golden share.", tese: "Ex-Eletrobras: maior geradora e transmissora do país, com dividendos projetados de 11–13%. A União mantém participação relevante." },
  TAEE11: { risco: 1, idx: 1, oque: "Taesa: opera linhas de transmissão de energia — recebe uma receita fixa anual (RAP) por manter as linhas disponíveis.", subsetor: "Transmissão de energia (RAP)", expoeA: "Receita contratada por 30 anos e corrigida pela inflação; sem risco de demanda.", tese: "Transmissão pura: receita contratada por décadas e corrigida pela inflação; dividendos previsíveis." },
  ISAE4: { risco: 1, idx: 1, oque: "ISA Energia (ex-Cteep): segunda maior transmissora do país, controlada pelo grupo colombiano ISA.", subsetor: "Transmissão de energia (RAP)", expoeA: "Receita RAP indexada à inflação, com dividendos regulares.", tese: "ISA Energia: transmissão com receita (RAP) corrigida pela inflação e dividendos de ~6%." },
  ALUP11: { risco: 1, idx: 1, oque: "Alupar: transmissão de energia (RAP) + parques eólicos e hidrelétricas.", subsetor: "Transmissão e geração renovável", expoeA: "Receita RAP indexada + venda de energia em contratos longos.", tese: "Transmissão e geração com receita indexada e lucro em expansão." },
  EGIE3: { risco: 1, idx: 1, oque: "Engie Brasil: geração de energia 100% renovável (hidrelétrica, eólica e solar).", subsetor: "Geração de energia renovável", expoeA: "Preço da energia em contratos longos indexados à inflação.", tese: "Engie: geração renovável com contratos longos indexados à inflação; ROE ~23%." },
  CPLE3: { risco: 1, idx: 1, oque: "Copel: elétrica do Paraná, privatizada em 2023 — distribuição, geração e transmissão.", subsetor: "Energia elétrica — integrada", expoeA: "Mercado paranaense de distribuição + geração; ganho de eficiência pós-privatização.", tese: "Copel privatizada: ganhos de eficiência e dividendos de 8–11%." },
  CPFE3: { risco: 1, idx: 1, oque: "CPFL Energia: distribuição no interior de SP e RS + geração renovável.", subsetor: "Distribuição e geração de energia", expoeA: "Mercado consumidor de SP e geração própria.", tese: "Distribuição e geração de qualidade, mas com recomendação de Venda da XP." },
  EQTL3: { risco: 1, idx: 1, juros: 1, oque: "Equatorial: maior distribuidora privada do país — PA, MA, PI, AL, GO, RJ e saneamento.", subsetor: "Distribuição de energia", expoeA: "Tarifa regulada indexada à inflação; sensível a juros pela dívida alta.", tese: "Melhor operadora de distribuição do país, porém alavancada (~5x EBITDA)." },
  ENGI11: { risco: 1, idx: 1, juros: 1 }, ENEV3: { risco: 1, juros: 1 }, PASS3: { risco: 1, idx: 1 },
  CMIG4: { risco: 2, idx: 1, oque: "Cemig: distribuição, geração e transmissão de energia em Minas Gerais.", subsetor: "Energia elétrica — estatal estadual", expoeA: "Mercado de energia de MG; dividendos influenciados pelo governo estadual.", tese: "Cemig: estatal mineira com dividendos, mas sujeita a decisões do governo estadual." },
  AURE3: { risco: 1, juros: 2 }, LIGT3: { risco: 1, juros: 2 },

  // Mineração, siderurgia e papel
  VALE3: { usd: 2, risco: 1, oque: "Vale: maior produtora de minério de ferro do mundo + níquel e cobre.", subsetor: "Mineração — minério de ferro", expoeA: "Demanda chinesa por aço e preço do minério em dólar.", tese: "Receita praticamente toda em dólar, P/L ~7x e DY de 6–8%; exposta à China e com histórico de pressão política na sucessão." },
  GGBR4: { usd: 2, oque: "Gerdau: produz aço longo (vergalhões, perfis) no Brasil, EUA, Canadá e América Latina.", subsetor: "Siderurgia — aço longo", expoeA: "Construção civil nos EUA e Brasil; forte presença no mercado americano.", tese: "Gerdau: operação relevante nos EUA e balanço sólido." },
  GOAU4: { usd: 2, oque: "Metalúrgica Gerdau: holding controladora da Gerdau (recebe dividendos da operação).", subsetor: "Siderurgia (holding)", expoeA: "Mesma exposição da GGBR4 via dividendos da controlada." },
  BRAP4: { usd: 2, oque: "Bradespar: holding com participação relevante na Vale (minério de ferro).", subsetor: "Mineração (holding Vale)", expoeA: "Dividendos da Vale, com desconto típico de holding." },
  AURA33: { usd: 2, oque: "Aura Minerals: mineradora de ouro e cobre com minas no Brasil, Honduras e México.", subsetor: "Mineração — ouro e cobre", expoeA: "Preço do ouro em dólar; defensiva em crises monetárias.", tese: "Mineradora de ouro: proteção clássica em crise, mas negociada a múltiplos elevados." },
  CMIN3: { usd: 2, gov: 1, oque: "CSN Mineração: minério de ferro + terminal portuário Itaguaí (RJ).", subsetor: "Mineração — minério de ferro", expoeA: "Preço do minério e demanda chinesa; controlada pela CSN (alavancada).", tese: "Minério de ferro com receita em dólar, mas controlada pela CSN, um grupo muito alavancado." },
  CBAV3: { usd: 2, oque: "CBA (Companhia Brasileira de Alumínio): produtora integrada de alumínio do grupo Votorantim.", subsetor: "Metais — alumínio", expoeA: "Preço do alumínio em dólar na LME." },
  USIM5: { usd: 1, juros: 1, oque: "Usiminas: produz aço plano usado em automóveis, eletrodomésticos e construção.", subsetor: "Siderurgia — aço plano", expoeA: "Produção de carros e indústria pesada no Brasil." },
  CSNA3: { usd: 1, juros: 2, gov: 1, oque: "CSN: aço plano + mineração de ferro + cimento + logística — conglomerado.", subsetor: "Siderurgia e mineração (conglomerado)", expoeA: "Mix de aço, minério, cimento; dívida alta exige atenção." },
  SUZB3: { usd: 2, oque: "Suzano: maior produtora de celulose de eucalipto do mundo (polpa branqueada).", subsetor: "Celulose e papel", expoeA: "Preço da celulose em dólar e demanda global por papel-tissue e embalagem.", tese: "Maior produtora de celulose do mundo, com ~90% da receita em dólar; lucro contábil oscila com o câmbio." },
  KLBN11: { usd: 1, oque: "Klabin: celulose fluff, papel kraftliner, sacos industriais e embalagens de papelão.", subsetor: "Papel, embalagens e celulose", expoeA: "Agronegócio (sacos de ração/fertilizante), e-commerce e exportação de celulose.", tese: "Papel, embalagens e celulose com parte relevante exportada; ciclo de investimentos maduro." },
  RANI3: { usd: 1 },

  // Shoppings
  MULT3: { idx: 1, juros: 1, oque: "Multiplan: opera shoppings premium (BarraShopping, MorumbiShopping, Village Mall).", subsetor: "Shoppings de alta renda", expoeA: "Consumo da classe A/B; aluguéis corrigidos pela inflação (IPCA).", tese: "Shoppings de alta renda com aluguéis corrigidos pela inflação." },
  ALOS3: { idx: 1, juros: 1, oque: "Allos: fusão Aliansce + Sonae — maior plataforma de shoppings do país.", subsetor: "Shoppings diversificados", expoeA: "Fluxo em shoppings de todo o Brasil; aluguéis corrigidos pela inflação.", tese: "Maior plataforma de shoppings do país; DY próximo de 9%." },
  IGTI11: { idx: 1, juros: 1 }, JHSF3: { idx: 1, juros: 1 }, LOGG3: { idx: 1, juros: 1 },

  // Saneamento
  SBSP3: { risco: 1, idx: 1, oque: "Sabesp: saneamento (água e esgoto) na capital e na maior parte do interior de SP — privatizada em 2024.", subsetor: "Saneamento básico — SP", expoeA: "Tarifa indexada à inflação + metas de universalização pós-privatização.", tese: "Sabesp privatizada: tarifa indexada e lucro projetado em forte alta para 2027." },
  CSMG3: { risco: 2, idx: 1, oque: "Copasa: saneamento (água e esgoto) em Minas Gerais, estatal estadual.", subsetor: "Saneamento básico — MG (estatal)", expoeA: "Tarifa indexada à inflação; dividendos influenciados pelo governo mineiro.", tese: "Copasa: tarifa indexada e dividendos altos, mas sob controle estadual." },
  SAPR11: { risco: 2, idx: 1 }, ORVR3: { risco: 1, idx: 1 },

  // Saúde
  RDOR3: { juros: 1, oque: "Rede D'Or São Luiz: maior rede de hospitais privados do Brasil, com integração à SulAmérica (planos de saúde).", subsetor: "Hospitais e planos de saúde (integrado)", expoeA: "Volume de atendimentos privados e sinergias com a SulAmérica.", tese: "Maior rede hospitalar privada do país, integrada à SulAmérica." },
  HYPE3: { juros: 1 }, FLRY3: { juros: 1 }, DASA3: { juros: 2 }, MATD3: { juros: 1 }, QUAL3: { juros: 2 }, BLAU3: { usd: 1 },

  // TMT
  VIVT3: { risco: 1, oque: "Telefônica/Vivo: líder em telefonia móvel e banda larga fixa (fibra ótica) no Brasil.", subsetor: "Telecomunicações", expoeA: "Base de assinantes de celular, fibra ótica e TV; receita recorrente mensal.", tese: "Vivo: líder em telecom, com receita recorrente, balanço quase sem dívida e dividendos crescentes." },
  TIMS3: { risco: 1, oque: "TIM Brasil: segunda maior operadora de celular do país, pós-aquisição da Oi Móvel.", subsetor: "Telecomunicações — mobile", expoeA: "Base de assinantes de celular e fibra residencial.", tese: "TIM: forte geração de caixa, caixa líquido e DY próximo de 9%." },
  TOTS3: { oque: "Totvs: líder em ERP (sistema de gestão) para empresas brasileiras — software como assinatura (SaaS).", subsetor: "Software corporativo (ERP)", expoeA: "Receita recorrente de empresas brasileiras; cresce com digitalização de PMEs.", tese: "Líder em software de gestão (ERP) no Brasil, com receita recorrente e ROE alto." },
  INTB3: { juros: 1 }, LWSA3: { juros: 2 }, POSI3: { juros: 2 }, BMOB3: {}, DESK3: { juros: 1 }, FIQE3: { juros: 1 },

  // Transportes
  MOTV3: { risco: 1, idx: 1, juros: 1, oque: "Motiva (ex-CCR): opera concessões de rodovias, aeroportos (BH, Curitiba) e metrôs/VLTs.", subsetor: "Concessões de infraestrutura", expoeA: "Tráfego de rodovias, aeroportos e metrôs; tarifas corrigidas pela inflação.", tese: "Motiva (ex-CCR): concessões de rodovias e aeroportos com tarifas indexadas." },
  RAIL3: { risco: 1, usd: 1, juros: 1, oque: "Rumo: maior ferrovia do Brasil — transporta grãos do MT ao porto de Santos.", subsetor: "Logística ferroviária (agro)", expoeA: "Volume exportado de soja, milho e açúcar via Santos; receita parcial em dólar.", tese: "Rumo: ferrovia do agronegócio exportador, em ciclo de investimento." },
  GGPS3: { oque: "GPS: líder em facility services (limpeza, segurança patrimonial, portaria) para grandes empresas.", subsetor: "Serviços terceirizados corporativos", expoeA: "Contratos recorrentes com grandes empresas; cresce por aquisições.", tese: "GPS: líder em serviços terceirizados, crescendo por aquisições com ROE ~20%." },
  ECOR3: { risco: 1, idx: 1, juros: 1 }, HBSA3: { usd: 1, idx: 1, juros: 1 },
  RENT3: { juros: 2, oque: "Localiza + Unidas: aluguel de carros (balcão) e terceirização de frota corporativa (gestão).", subsetor: "Mobilidade — aluguel de veículos", expoeA: "Demanda corporativa por frota + turismo; dívida alta sensível a juros.", tese: "Localiza: líder em aluguel de carros, mas alavancada e sensível a juros." },
  MOVI3: { juros: 2 }, VAMO3: { juros: 2 }, SIMH3: { juros: 2 }, MILS3: { juros: 1 }, JSLG3: { juros: 2 }, ARML3: { juros: 2 }, PRNR3: { juros: 1 }, AMOB3: { juros: 2 },

  // Varejo
  RADL3: { oque: "RD Saúde: dona das farmácias Droga Raia e Drogasil — maior rede do Brasil.", subsetor: "Varejo — farmácias", expoeA: "Consumo de medicamentos e produtos de higiene/beleza (defensivo); expansão de lojas.", tese: "RD Saúde: farmácias (consumo defensivo) com expansão consistente." },
  MELI: { juros: 1, oque: "Mercado Livre: maior marketplace da América Latina + Mercado Pago (banco digital) + Mercado Envios (logística).", subsetor: "E-commerce e fintech LATAM", expoeA: "Consumo digital em Brasil, México, Argentina, Chile e Colômbia; cotada em US$.", tese: "Mercado Livre: líder de e-commerce e fintech na América Latina (cotada em US$)." },
  ASAI3: { juros: 2 }, SMFT3: { juros: 1 }, LREN3: { juros: 2 }, GMAT3: { juros: 1 }, NATU3: { juros: 2 },
  ALPA4: { usd: 1, juros: 1 }, MGLU3: { juros: 2 }, VIVA3: { juros: 1 }, RIAA3: { juros: 2 }, AZZA3: { juros: 2 },
  VULC3: { juros: 1 }, CEAB3: { juros: 2 }, PGMN3: { juros: 1 }, PNVL3: { juros: 1 }, TFCO4: { juros: 2 },
  AUAU3: { juros: 2 }, SBFG3: { juros: 2 },

  // Óleo, gás e petroquímicos
  PETR4: { usd: 2, risco: 3, oque: "Petrobras: estatal integrada de petróleo — exploração (pré-sal), refino e distribuição.", subsetor: "Óleo e gás — estatal", expoeA: "Preço do petróleo (Brent) + política de preços e dividendos definida pela União.", tese: "Geração de caixa enorme e DY de 7–8%, mas é o ativo mais exposto a interferência (preços, investimentos e dividendos)." },
  PRIO3: { usd: 2, oque: "PRIO: petroleira privada que compra campos maduros (Frade, Albacora, Wahoo) e produz com baixo custo.", subsetor: "Óleo e gás — exploração offshore", expoeA: "Preço do petróleo em dólar; sem exposição a decisões políticas.", tese: "Petroleira privada mais eficiente do país: receita em dólar e sem risco de interferência estatal." },
  VBBR3: { juros: 1, oque: "Vibra Energia (ex-BR Distribuidora): maior rede de postos de combustíveis do Brasil (Petrobras BR).", subsetor: "Distribuição de combustíveis", expoeA: "Volume vendido nos postos; margem de distribuição + conveniência.", tese: "Vibra: maior distribuidora de combustíveis do país, com DY ~7%." },
  UGPA3: { juros: 1 }, CSAN3: { juros: 2 }, BRAV3: { usd: 2, juros: 1 }, RECV3: { usd: 2, juros: 1 },
  UNIP6: { usd: 1 }, BRKM5: { usd: 1, juros: 2 },
};
