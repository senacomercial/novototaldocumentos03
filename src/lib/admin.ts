import { supabase } from './supabase';
import type { Status, Categoria } from '../types';

export interface AdminPedido {
  id: string;
  protocolo: string;
  categoria: Categoria;
  categoriaName: string;
  titulo: string;
  status: Status;
  dataPedido: string;
  prazoEstimado: string | null;
  progress: number;
  valor: number;
  certificado: boolean;
  arquivoUrl: string | null;
  notasInternas: string | null;
  userEmail: string;
  nomeCompleto: string | null;
  cpf: string | null;
  emailAutor: string | null;
  telefone: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  descricao: string | null;
}

interface AdminPedidoRow {
  id: string;
  protocolo: string;
  categoria: string;
  categoria_name: string;
  titulo: string;
  status: string;
  data_pedido: string;
  prazo_estimado: string | null;
  progress: number;
  valor: number;
  certificado: boolean;
  arquivo_url: string | null;
  notas_internas: string | null;
  user_email: string;
  nome_completo: string | null;
  cpf: string | null;
  email_autor: string | null;
  telefone: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  descricao: string | null;
}

function rowToAdminPedido(row: AdminPedidoRow): AdminPedido {
  return {
    id: row.id,
    protocolo: row.protocolo,
    categoria: row.categoria as Categoria,
    categoriaName: row.categoria_name,
    titulo: row.titulo,
    status: row.status as Status,
    dataPedido: row.data_pedido,
    prazoEstimado: row.prazo_estimado,
    progress: row.progress,
    valor: Number(row.valor),
    certificado: row.certificado,
    arquivoUrl: row.arquivo_url,
    notasInternas: row.notas_internas,
    userEmail: row.user_email,
    nomeCompleto: row.nome_completo,
    cpf: row.cpf,
    emailAutor: row.email_autor,
    telefone: row.telefone,
    logradouro: row.logradouro,
    numero: row.numero,
    complemento: row.complemento,
    cidade: row.cidade,
    estado: row.estado,
    cep: row.cep,
    descricao: row.descricao,
  };
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();
  if (error) return false;
  return !!data?.is_admin;
}

export async function fetchAllPedidosAdmin(): Promise<AdminPedido[]> {
  const { data, error } = await supabase.rpc('admin_listar_pedidos');
  if (error) throw error;
  return ((data as AdminPedidoRow[]) ?? []).map(rowToAdminPedido);
}

export async function updatePedidoAdmin(params: {
  pedidoId: string;
  status?: Status;
  prazoEstimado?: string | null;
  notasInternas?: string | null;
  certificado?: boolean;
}): Promise<void> {
  const { error } = await supabase.rpc('admin_atualizar_pedido', {
    p_pedido_id: params.pedidoId,
    p_status: params.status ?? null,
    p_prazo_estimado: params.prazoEstimado ?? null,
    p_notas_internas: params.notasInternas ?? null,
    p_certificado: params.certificado ?? null,
  });
  if (error) throw error;
}

export async function getObraSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from('obras').createSignedUrl(path, 300);
  if (error) throw error;
  return data.signedUrl;
}
