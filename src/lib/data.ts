import { CategoryInfo, Categoria, Pacote, Beneficio, HowStep, FAQ, Pedido } from '../types';

// As 16 categorias individuais aceitas para um pedido (usadas no formulário de envio da obra)
export const ALL_CATEGORIAS: { key: Categoria; name: string }[] = [
  { key: 'MUSICAS', name: 'Músicas' },
  { key: 'LETRAS', name: 'Letras' },
  { key: 'CLIPES', name: 'Clipes' },
  { key: 'TEXTOS', name: 'Textos' },
  { key: 'LIVROS', name: 'Livros' },
  { key: 'EBOOKS', name: 'E-books' },
  { key: 'CONTRATOS', name: 'Contratos' },
  { key: 'TESES', name: 'Teses' },
  { key: 'CURSOS', name: 'Cursos' },
  { key: 'FOTOGRAFIAS', name: 'Fotografias' },
  { key: 'ARTES', name: 'Artes' },
  { key: 'ANUNCIOS', name: 'Anúncios' },
  { key: 'VIDEOS', name: 'Vídeos' },
  { key: 'PLANTAS', name: 'Plantas' },
  { key: 'PROJETOS', name: 'Projetos' },
  { key: 'PERSONAGENS', name: 'Personagens' },
];

export const CATEGORIES: CategoryInfo[] = [
  { key: 'MUSICAS', name: 'Músicas e Letras', desc: 'Composições musicais, letras e obras líricas.', icon: 'Music' },
  { key: 'VIDEOS', name: 'Vídeos e Clipes', desc: 'Filmes, documentários, clipes e produções audiovisuais.', icon: 'Film' },
  { key: 'LIVROS', name: 'Livros e E-books', desc: 'Obras literárias e livros digitais.', icon: 'Book' },
  { key: 'TEXTOS', name: 'Textos e Contratos', desc: 'Artigos, roteiros, crônicas e documentos comerciais.', icon: 'Text' },
  { key: 'TESES', name: 'Teses e Cursos', desc: 'Dissertações, trabalhos acadêmicos e conteúdo educacional.', icon: 'Thesis' },
  { key: 'FOTOGRAFIAS', name: 'Fotografias e Artes', desc: 'Fotos, pinturas, ilustrações e arte digital.', icon: 'Camera' },
  { key: 'PLANTAS', name: 'Plantas e Projetos', desc: 'Plantas arquitetônicas, projetos de design e engenharia.', icon: 'Plant' },
  { key: 'ANUNCIOS', name: 'Anúncios e Personagens', desc: 'Campanhas publicitárias e personagens originais.', icon: 'Ad' },
];

export const PACOTES: Pacote[] = [
  { id: '1reg', registros: 1, preco: 47.90, label: '1 Registro', desc: 'Para sua primeira obra.', featured: false },
  { id: '2reg', registros: 2, preco: 77.90, label: '2 Registros', desc: 'Economize R$ 17,90 — ideal para quem produz com frequência.', featured: true, savings: 'Economize 19%' },
  { id: '3reg', registros: 3, preco: 97.90, label: '3 Registros', desc: 'Melhor custo por registro — para quem produz em série.', featured: false, savings: 'Economize 32%' },
];

export const BENEFICIOS: Beneficio[] = [
  { icon: 'Shield', title: 'Certificado oficial', desc: 'Documento digital com validade jurídica reconhecida.' },
  { icon: 'Chain', title: 'Prova em blockchain', desc: 'Hash da sua obra registrado em rede pública e imutável.' },
  { icon: 'Bolt', title: 'Em até 24h', desc: 'Processo automatizado, sem cartório presencial.' },
  { icon: 'Clock', title: 'Vale por toda a vida', desc: 'Mais 70 anos após o falecimento do autor (lei 9.610).' },
  { icon: 'Mail', title: 'Acompanhe por email', desc: 'Você recebe atualização a cada etapa do processo.' },
  { icon: 'Download', title: 'Download na hora', desc: 'Baixe seu certificado pela área logada quando estiver pronto.' },
];

export const HOW: HowStep[] = [
  { n: '01', title: 'Você escolhe o pacote', desc: 'Selecione quantos registros precisa — 1, 2 ou 3 — e pague com Pix, cartão ou boleto pelo Mercado Pago.' },
  { n: '02', title: 'A gente cria sua conta', desc: 'Assim que o pagamento for confirmado, você recebe um email com seu protocolo e o link de acesso à sua área.' },
  { n: '03', title: 'Você envia sua obra', desc: 'Faça upload do arquivo pela plataforma. A gente cuida da análise, registro e geração do certificado.' },
  { n: '04', title: 'Certificado em mãos', desc: 'Em até 24h seu certificado fica pronto. Download imediato + cópia enviada por email.' },
];

export const FAQ_DATA: FAQ[] = [
  { q: 'Como sei que meu registro tem validade jurídica?', a: 'O certificado emitido pela Totalis é amparado pela Lei de Direitos Autorais nº 9.610/98, que estabelece a proteção da obra desde sua criação. A prova em blockchain reforça com timestamp imutável.' },
  { q: 'Quanto tempo demora?', a: 'O prazo padrão é de 24h a partir da confirmação do pagamento e do envio da sua obra. Você acompanha cada etapa pelo dashboard.' },
  { q: 'Posso registrar uma obra que já publiquei?', a: 'Sim. O registro pode ser feito a qualquer momento — antes ou depois da publicação. O importante é estabelecer a anterioridade da autoria.' },
  { q: 'Como funciona o pacote com vários registros?', a: 'Você compra de uma vez e usa os créditos quando quiser, sem prazo de expiração. Cada registro pode ser de uma categoria diferente.' },
  { q: 'Quais formas de pagamento vocês aceitam?', a: 'Pix, cartão de crédito (até 12x) e boleto, processados pelo Mercado Pago com toda segurança.' },
  { q: 'O certificado vale fora do Brasil?', a: 'A Lei 9.610 é reconhecida pela Convenção de Berna, da qual o Brasil é signatário. Isso garante proteção em mais de 180 países.' },
];

export const MOCK_PEDIDOS: Pedido[] = [
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
