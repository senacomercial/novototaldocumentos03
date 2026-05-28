// Categories and mock data for Totalis

const CATEGORIES = [
  { key: 'MUSICAS', name: 'Músicas', desc: 'Composições musicais — instrumentais ou com vocais.', icon: 'Music' },
  { key: 'LETRAS', name: 'Letras', desc: 'Letras de música, poesia e composição lírica.', icon: 'Lyrics' },
  { key: 'CLIPES', name: 'Clipes', desc: 'Videoclipes, lyric videos e produções musicais.', icon: 'Video' },
  { key: 'TEXTOS', name: 'Textos', desc: 'Artigos, crônicas, roteiros e qualquer obra escrita.', icon: 'Text' },
  { key: 'LIVROS', name: 'Livros', desc: 'Obras literárias completas, ficção ou não-ficção.', icon: 'Book' },
  { key: 'EBOOKS', name: 'E-books', desc: 'Livros em formato digital prontos para distribuição.', icon: 'Ebook' },
  { key: 'CONTRATOS', name: 'Contratos', desc: 'Modelos de contrato e documentos comerciais.', icon: 'Contract' },
  { key: 'TESES', name: 'Teses', desc: 'Dissertações, teses e trabalhos acadêmicos.', icon: 'Thesis' },
  { key: 'CURSOS', name: 'Cursos', desc: 'Conteúdo educacional, aulas e treinamentos.', icon: 'Course' },
  { key: 'FOTOGRAFIAS', name: 'Fotografias', desc: 'Fotos autorais, ensaios e portfólios.', icon: 'Camera' },
  { key: 'ARTES', name: 'Artes', desc: 'Pinturas, ilustrações e arte digital.', icon: 'Art' },
  { key: 'ANUNCIOS', name: 'Anúncios', desc: 'Campanhas publicitárias e peças de mídia.', icon: 'Ad' },
  { key: 'VIDEOS', name: 'Vídeos', desc: 'Filmes, documentários e produções audiovisuais.', icon: 'Film' },
  { key: 'PLANTAS', name: 'Plantas', desc: 'Plantas arquitetônicas e projetos técnicos.', icon: 'Plant' },
  { key: 'PROJETOS', name: 'Projetos', desc: 'Projetos de design, engenharia e inovação.', icon: 'Project' },
  { key: 'PERSONAGENS', name: 'Personagens', desc: 'Personagens originais para histórias e jogos.', icon: 'Character' },
];

const PACOTES = [
  { id: '1reg', registros: 1, preco: 47.90, label: '1 Registro', desc: 'Para sua primeira obra.', featured: false },
  { id: '2reg', registros: 2, preco: 77.90, label: '2 Registros', desc: 'Economize R$ 17,90 — ideal para quem produz com frequência.', featured: true, savings: 'Economize 19%' },
  { id: '3reg', registros: 3, preco: 97.90, label: '3 Registros', desc: 'Melhor custo por registro — para quem produz em série.', featured: false, savings: 'Economize 32%' },
];

const BENEFICIOS = [
  { icon: 'Shield', title: 'Certificado oficial', desc: 'Documento digital com validade jurídica reconhecida.' },
  { icon: 'Chain', title: 'Prova em blockchain', desc: 'Hash da sua obra registrado em rede pública e imutável.' },
  { icon: 'Bolt', title: 'Em até 20 dias úteis', desc: 'Processo automatizado, sem cartório presencial.' },
  { icon: 'Clock', title: 'Vale por toda a vida', desc: 'Mais 70 anos após o falecimento do autor (lei 9.610).' },
  { icon: 'Mail', title: 'Acompanhe por email', desc: 'Você recebe atualização a cada etapa do processo.' },
  { icon: 'Download', title: 'Download na hora', desc: 'Baixe seu certificado pela área logada quando estiver pronto.' },
  { icon: 'Search', title: 'Consulta pública', desc: 'Comprovação verificável por qualquer pessoa via protocolo.' },
];

const HOW = [
  { n: '01', title: 'Você escolhe o pacote', desc: 'Selecione quantos registros precisa — 1, 2 ou 3 — e pague com Pix, cartão ou boleto pelo Mercado Pago.' },
  { n: '02', title: 'A gente cria sua conta', desc: 'Assim que o pagamento for confirmado, você recebe um email com seu protocolo e o link de acesso à sua área.' },
  { n: '03', title: 'Você envia sua obra', desc: 'Faça upload do arquivo pela plataforma. A gente cuida da análise, registro e geração do certificado.' },
  { n: '04', title: 'Certificado em mãos', desc: 'Em até 20 dias úteis seu certificado fica pronto. Download imediato + cópia enviada por email.' },
];

const FAQ = [
  { q: 'Como sei que meu registro tem validade jurídica?', a: 'O certificado emitido pela Totalis é amparado pela Lei de Direitos Autorais nº 9.610/98, que estabelece a proteção da obra desde sua criação. A prova em blockchain reforça com timestamp imutável.' },
  { q: 'Quanto tempo demora?', a: 'O prazo padrão é de 20 dias úteis a partir da confirmação do pagamento e do envio da sua obra. Você acompanha cada etapa pelo dashboard.' },
  { q: 'Posso registrar uma obra que já publiquei?', a: 'Sim. O registro pode ser feito a qualquer momento — antes ou depois da publicação. O importante é estabelecer a anterioridade da autoria.' },
  { q: 'Como funciona o pacote com vários registros?', a: 'Você compra de uma vez e usa os créditos quando quiser, sem prazo de expiração. Cada registro pode ser de uma categoria diferente.' },
  { q: 'Quais formas de pagamento vocês aceitam?', a: 'Pix, cartão de crédito (até 12x) e boleto, processados pelo Mercado Pago com toda segurança.' },
  { q: 'O certificado vale fora do Brasil?', a: 'A Lei 9.610 é reconhecida pela Convenção de Berna, da qual o Brasil é signatário. Isso garante proteção em mais de 180 países.' },
];

const MOCK_PEDIDOS = [
  {
    id: 'p1', protocolo: 'TOT-202611-04823',
    categoria: 'MUSICAS', categoriaName: 'Músicas',
    titulo: 'Sintonia 432Hz — EP completo',
    status: 'EM_PROCESSAMENTO',
    dataPedido: '12 Nov 2026',
    prazoEstimado: '10 Dez 2026',
    progress: 60,
    valor: 77.90,
  },
  {
    id: 'p2', protocolo: 'TOT-202611-04824',
    categoria: 'LETRAS', categoriaName: 'Letras',
    titulo: 'Letras para o EP "Sintonia"',
    status: 'EM_ANALISE',
    dataPedido: '12 Nov 2026',
    prazoEstimado: '10 Dez 2026',
    progress: 35,
    valor: 0,
  },
  {
    id: 'p3', protocolo: 'TOT-202609-03991',
    categoria: 'TEXTOS', categoriaName: 'Textos',
    titulo: 'Roteiro: "Caminho de Casa" (curta-metragem)',
    status: 'CONCLUIDO',
    dataPedido: '18 Set 2026',
    prazoEstimado: '15 Out 2026',
    progress: 100,
    valor: 47.90,
    certificado: true,
  },
];

window.CATEGORIES = CATEGORIES;
window.PACOTES = PACOTES;
window.BENEFICIOS = BENEFICIOS;
window.HOW = HOW;
window.FAQ = FAQ;
window.MOCK_PEDIDOS = MOCK_PEDIDOS;
