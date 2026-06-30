// Tipos para o sistema Totalis

export type Status = 'RECEBIDO' | 'EM_ANALISE' | 'EM_PROCESSAMENTO' | 'CONCLUIDO' | 'CANCELADO';

export type Categoria =
  | 'MUSICAS' | 'LETRAS' | 'CLIPES' | 'TEXTOS' | 'LIVROS' | 'EBOOKS'
  | 'CONTRATOS' | 'TESES' | 'CURSOS' | 'FOTOGRAFIAS' | 'ARTES'
  | 'ANUNCIOS' | 'VIDEOS' | 'PLANTAS' | 'PROJETOS' | 'PERSONAGENS';

export type TipoPacote = '1reg' | '2reg' | '3reg';

export interface CategoryInfo {
  key: Categoria;
  name: string;
  desc: string;
  icon: string;
}

export interface Pacote {
  id: TipoPacote;
  registros: number;
  preco: number;
  label: string;
  desc: string;
  featured: boolean;
  savings?: string;
}

export interface Beneficio {
  icon: string;
  title: string;
  desc: string;
}

export interface HowStep {
  n: string;
  title: string;
  desc: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Pedido {
  id: string;
  protocolo: string;
  categoria: Categoria;
  categoriaName: string;
  titulo: string;
  status: Status;
  dataPedido: string;
  prazoEstimado: string;
  progress: number;
  valor: number;
  certificado?: boolean;
  arquivoUrl?: string | null;
}

export interface User {
  id: string;
  email: string;
  nomeCompleto: string;
  telefone?: string;
  cpfCnpj?: string;
  criadoEm: string;
}

export interface Tweaks {
  accent: 'purple' | 'blue' | 'emerald' | 'magenta' | 'amber';
  theme: 'dark' | 'light';
  density: 'compact' | 'regular' | 'comfy';
  typeStyle: 'serif-accent' | 'bold-sans' | 'grotesk';
  categoryLayout: 'grid' | 'list' | 'carousel';
  headline: string;
  headlineAccent: string;
}
