import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { checkIsAdmin, fetchAllPedidosAdmin, updatePedidoAdmin, getObraSignedUrl, AdminPedido } from '../lib/admin';
import { Status } from '../types';

interface AdminProps {
  navigate: (path: string, section?: string) => void;
}

const STATUS_OPTIONS: Status[] = ['RECEBIDO', 'EM_ANALISE', 'EM_PROCESSAMENTO', 'CONCLUIDO', 'CANCELADO'];

export const Admin: React.FC<AdminProps> = ({ navigate }) => {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pedidos, setPedidos] = useState<AdminPedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [selectedPedido, setSelectedPedido] = useState<AdminPedido | null>(null);

  function reload() {
    setLoading(true);
    fetchAllPedidosAdmin()
      .then(setPedidos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id;
      if (!uid) {
        setChecking(false);
        return;
      }
      checkIsAdmin(uid).then((admin) => {
        setIsAdmin(admin);
        setChecking(false);
        if (admin) reload();
      });
    });
  }, []);

  async function handleStatusChange(pedido: AdminPedido, status: Status) {
    setSavingId(pedido.id);
    try {
      await updatePedidoAdmin({ pedidoId: pedido.id, status });
      reload();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao atualizar status.');
    } finally {
      setSavingId(null);
    }
  }

  async function handleVerArquivo(path: string) {
    try {
      const url = await getObraSignedUrl(path);
      window.open(url, '_blank');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao gerar link do arquivo.');
    }
  }

  if (checking) {
    return <main style={{ flex: 1, padding: '48px' }}>Verificando acesso…</main>;
  }

  if (!isAdmin) {
    return (
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)', padding: '48px', textAlign: 'center', maxWidth: '400px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>Acesso restrito</h3>
          <p style={{ margin: '0 0 24px', color: 'var(--fg-muted)', fontSize: '14px' }}>
            Esta área é exclusiva para administradores.
          </p>
          <button className="btn btn-primary" style={{ height: '40px' }} onClick={() => navigate('/login')}>
            Entrar com outra conta
          </button>
        </div>
      </main>
    );
  }

  const novosEnvios = pedidos.filter((p) => p.status === 'EM_ANALISE');

  return (
    <main style={{ flex: 1 }}>
      <section style={{ paddingTop: 'var(--pad-section)', paddingBottom: 'var(--pad-section)' }}>
        <div className="container">
          <h1 className="display" style={{ margin: '0 0 8px', fontSize: '32px' }}>Painel Administrativo</h1>
          <p style={{ margin: '0 0 32px', color: 'var(--fg-muted)', fontSize: '14px' }}>
            {novosEnvios.length > 0
              ? `🔔 ${novosEnvios.length} obra(s) recém-enviada(s) aguardando análise`
              : 'Nenhuma obra nova aguardando análise'}
          </p>

          {loading && <p style={{ color: 'var(--fg-muted)' }}>Carregando pedidos…</p>}
          {error && <p style={{ color: '#ef4444' }}>{error}</p>}

          {!loading && !error && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '10px' }}>Protocolo</th>
                    <th style={{ padding: '10px' }}>Cliente</th>
                    <th style={{ padding: '10px' }}>Categoria</th>
                    <th style={{ padding: '10px' }}>Título</th>
                    <th style={{ padding: '10px' }}>Arquivo</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPedido(p)}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: p.status === 'EM_ANALISE' ? 'rgba(168,85,247,0.06)' : 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <td style={{ padding: '10px', fontFamily: 'monospace' }}>{p.protocolo}</td>
                      <td style={{ padding: '10px' }}>{p.userEmail}</td>
                      <td style={{ padding: '10px' }}>{p.categoriaName}</td>
                      <td style={{ padding: '10px' }}>{p.titulo}</td>
                      <td style={{ padding: '10px' }}>
                        {p.arquivoUrl ? (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleVerArquivo(p.arquivoUrl!)}
                          >
                            📎 Ver
                          </button>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <select
                          value={p.status}
                          disabled={savingId === p.id}
                          onChange={(e) => handleStatusChange(p, e.target.value as Status)}
                          style={{
                            background: 'var(--bg-surface)', border: '1px solid var(--border)',
                            borderRadius: 'var(--r-sm)', color: 'var(--fg)', fontSize: '13px',
                            padding: '4px 8px',
                          }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '10px' }}>{p.progress}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {selectedPedido && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '16px', zIndex: 1000,
          }}
          onClick={() => setSelectedPedido(null)}
        >
          <div
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: '32px', maxWidth: '600px',
              width: '100%', maxHeight: '80vh', overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px' }}>Detalhes do Pedido</h2>
              <button
                onClick={() => setSelectedPedido(null)}
                style={{
                  background: 'none', border: 'none', fontSize: '24px',
                  cursor: 'pointer', color: 'var(--fg-muted)',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)', display: 'block', marginBottom: '4px' }}>Protocolo</label>
                <p style={{ margin: 0, fontSize: '14px' }}>{selectedPedido.protocolo}</p>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)', display: 'block', marginBottom: '4px' }}>Status</label>
                <p style={{ margin: 0, fontSize: '14px' }}>{selectedPedido.status}</p>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)', display: 'block', marginBottom: '4px' }}>Categoria</label>
                <p style={{ margin: 0, fontSize: '14px' }}>{selectedPedido.categoriaName}</p>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)', display: 'block', marginBottom: '4px' }}>Data do Pedido</label>
                <p style={{ margin: 0, fontSize: '14px' }}>{new Date(selectedPedido.dataPedido).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600 }}>📋 Dados da Obra</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)' }}>Título</label>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedPedido.titulo || '—'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)' }}>Descrição</label>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedPedido.descricao || '—'}</p>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600 }}>👤 Dados do Autor</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)' }}>Nome Completo</label>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedPedido.nomeCompleto || '—'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)' }}>CPF</label>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedPedido.cpf || '—'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)' }}>Email</label>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedPedido.emailAutor || '—'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)' }}>Telefone</label>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedPedido.telefone || '—'}</p>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600 }}>📍 Endereço</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)' }}>Logradouro</label>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedPedido.logradouro || '—'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)' }}>Número</label>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedPedido.numero || '—'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)' }}>Complemento</label>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedPedido.complemento || '—'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)' }}>CEP</label>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedPedido.cep || '—'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)' }}>Cidade</label>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedPedido.cidade || '—'}</p>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--fg-muted)' }}>Estado</label>
                  <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedPedido.estado || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
