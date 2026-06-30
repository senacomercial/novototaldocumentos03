import { supabase } from './supabase';
import type { Pedido, Status, Categoria } from '../types';

interface PedidoRow {
  id: string;
  user_id: string;
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
  created_at: string;
  updated_at: string;
}

function rowToPedido(row: PedidoRow): Pedido {
  return {
    id: row.id,
    protocolo: row.protocolo,
    categoria: row.categoria as Categoria,
    categoriaName: row.categoria_name,
    titulo: row.titulo,
    status: row.status as Status,
    dataPedido: new Date(row.data_pedido).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
    }),
    prazoEstimado: row.prazo_estimado
      ? new Date(row.prazo_estimado).toLocaleDateString('pt-BR', {
          day: '2-digit', month: 'short', year: 'numeric',
        })
      : '—',
    progress: row.progress,
    valor: Number(row.valor),
    certificado: row.certificado,
    arquivoUrl: row.arquivo_url,
  };
}

// Returns YYYY-MM-DD of the next business day (skips Sat/Sun)
function nextBusinessDay(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  return d.toISOString().split('T')[0];
}

export async function fetchPedidos(userId: string): Promise<Pedido[]> {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return ((data as PedidoRow[]) ?? []).map(rowToPedido);
}

export interface EnviarObraParams {
  categoria: Categoria;
  categoriaName: string;
  titulo: string;
  arquivo: File;
  nomeCompleto: string;
  cpf: string;
  emailAutor: string;
  telefone: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
  descricao: string;
}

export async function enviarObra(
  userId: string,
  pedidoId: string,
  params: EnviarObraParams,
): Promise<void> {
  const ext = params.arquivo.name.split('.').pop();
  const path = `${userId}/${pedidoId}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from('obras')
    .upload(path, params.arquivo, { upsert: true });
  if (uploadErr) throw uploadErr;

  const { error: updateErr } = await supabase
    .from('pedidos')
    .update({
      categoria: params.categoria,
      categoria_name: params.categoriaName,
      titulo: params.titulo,
      arquivo_url: path,
      status: 'EM_ANALISE',
      progress: 20,
      prazo_estimado: nextBusinessDay(),
      nome_completo: params.nomeCompleto,
      cpf: params.cpf,
      email_autor: params.emailAutor,
      telefone: params.telefone,
      logradouro: params.logradouro,
      numero: params.numero,
      complemento: params.complemento,
      cidade: params.cidade,
      estado: params.estado,
      cep: params.cep,
      descricao: params.descricao,
    })
    .eq('id', pedidoId)
    .eq('user_id', userId);
  if (updateErr) throw updateErr;

  try {
    await supabase.functions.invoke('notificar-envio-obra', { body: { pedido_id: pedidoId } });
  } catch {
    // ignorado: notificação é best-effort
  }
}

export async function createPedido(
  userId: string,
  params: { categoria: Categoria; categoriaName: string; titulo: string; valor: number; prazoEstimado?: string }
): Promise<Pedido> {
  const { data, error } = await supabase
    .from('pedidos')
    .insert({
      user_id: userId,
      protocolo: '',
      categoria: params.categoria,
      categoria_name: params.categoriaName,
      titulo: params.titulo,
      valor: params.valor,
      prazo_estimado: params.prazoEstimado ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToPedido(data as PedidoRow);
}
