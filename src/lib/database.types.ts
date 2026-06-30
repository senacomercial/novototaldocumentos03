export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type StatusPedido = 'RECEBIDO' | 'EM_ANALISE' | 'EM_PROCESSAMENTO' | 'CONCLUIDO' | 'CANCELADO';
export type CategoriaObra =
  | 'MUSICAS' | 'LETRAS' | 'CLIPES' | 'TEXTOS' | 'LIVROS' | 'EBOOKS'
  | 'CONTRATOS' | 'TESES' | 'CURSOS' | 'FOTOGRAFIAS' | 'ARTES'
  | 'ANUNCIOS' | 'VIDEOS' | 'PLANTAS' | 'PROJETOS' | 'PERSONAGENS';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome_completo: string;
          telefone: string | null;
          cpf_cnpj: string | null;
          criado_em: string;
        };
        Insert: {
          id: string;
          nome_completo?: string;
          telefone?: string | null;
          cpf_cnpj?: string | null;
          criado_em?: string;
        };
        Update: {
          nome_completo?: string;
          telefone?: string | null;
          cpf_cnpj?: string | null;
        };
      };
      pedidos: {
        Row: {
          id: string;
          user_id: string;
          protocolo: string;
          categoria: CategoriaObra;
          categoria_name: string;
          titulo: string;
          status: StatusPedido;
          data_pedido: string;
          prazo_estimado: string | null;
          progress: number;
          valor: number;
          certificado: boolean;
          arquivo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          protocolo?: string;
          categoria: CategoriaObra;
          categoria_name: string;
          titulo: string;
          status?: StatusPedido;
          data_pedido?: string;
          prazo_estimado?: string | null;
          progress?: number;
          valor?: number;
          certificado?: boolean;
          arquivo_url?: string | null;
        };
        Update: {
          titulo?: string;
          status?: StatusPedido;
          prazo_estimado?: string | null;
          progress?: number;
          certificado?: boolean;
          arquivo_url?: string | null;
        };
      };
      compras: {
        Row: {
          id: string;
          user_id: string;
          pacote_id: string;
          registros: number;
          valor: number;
          creditos_restantes: number;
          payment_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pacote_id: string;
          registros: number;
          valor: number;
          creditos_restantes: number;
          payment_id?: string | null;
          status?: string;
        };
        Update: {
          creditos_restantes?: number;
          payment_id?: string | null;
          status?: string;
        };
      };
    };
  };
}
