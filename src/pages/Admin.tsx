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
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: p.status === 'EM_ANALISE' ? 'rgba(168,85,247,0.06)' : 'transparent',
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
    </main>
  );
};
