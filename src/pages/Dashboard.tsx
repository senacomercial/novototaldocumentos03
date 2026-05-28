import React from 'react';
import { Pedido, Status } from '../types';
import { MOCK_PEDIDOS } from '../lib/data';

interface DashboardProps {
  navigate: (path: string) => void;
}

function getStatusLabel(status: Status): string {
  const labels: Record<Status, string> = {
    RECEBIDO: 'Recebido',
    EM_ANALISE: 'Em Análise',
    EM_PROCESSAMENTO: 'Em Processamento',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado',
  };
  return labels[status];
}

function getStatusColor(status: Status): string {
  const colors: Record<Status, string> = {
    RECEBIDO: '#94a3b8',
    EM_ANALISE: '#f59e0b',
    EM_PROCESSAMENTO: '#3b82f6',
    CONCLUIDO: '#10b981',
    CANCELADO: '#ef4444',
  };
  return colors[status];
}

interface PedidoCardProps {
  pedido: Pedido;
  onViewDetails: () => void;
}

const PedidoCard: React.FC<PedidoCardProps> = ({ pedido, onViewDetails }) => {
  const statusColor = getStatusColor(pedido.status);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      padding: 'var(--pad-card)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      cursor: 'pointer',
      transition: 'all 200ms ease-out',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)';
      (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hi)';
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
      (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
    }}
    onClick={onViewDetails}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--fg-muted)', marginBottom: '4px' }}>
            Protocolo: {pedido.protocolo}
          </div>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600 }}>
            {pedido.titulo}
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--fg-muted)' }}>
            {pedido.categoriaName}
          </p>
        </div>
        <div style={{
          background: statusColor,
          color: 'white',
          padding: '4px 12px',
          borderRadius: 'var(--r-sm)',
          fontSize: '12px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          {getStatusLabel(pedido.status)}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>Progresso</span>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>{pedido.progress}%</span>
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          background: 'var(--border)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${pedido.progress}%`,
            background: `linear-gradient(90deg, var(--accent-soft), var(--accent-deep))`,
            transition: 'width 300ms ease-out',
          }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
        <div>
          <span style={{ color: 'var(--fg-muted)' }}>Solicitado em</span>
          <div style={{ fontWeight: 600, marginTop: '2px' }}>{pedido.dataPedido}</div>
        </div>
        <div>
          <span style={{ color: 'var(--fg-muted)' }}>Prazo estimado</span>
          <div style={{ fontWeight: 600, marginTop: '2px' }}>{pedido.prazoEstimado}</div>
        </div>
      </div>

      {pedido.certificado && (
        <button
          className="btn btn-secondary"
          style={{ width: '100%', fontSize: '13px', height: '36px' }}
          onClick={(e) => {
            e.stopPropagation();
            alert('Download do certificado iniciado!');
          }}
        >
          📥 Baixar Certificado
        </button>
      )}
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  return (
    <main style={{ flex: 1 }}>
      <section style={{ paddingTop: 'var(--pad-section)', paddingBottom: 'var(--pad-section)' }}>
        <div className="container-narrow">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
            <div>
              <h1 className="display" style={{ margin: '0 0 8px', fontSize: '32px' }}>
                Minha Área
              </h1>
              <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '14px' }}>
                Acompanhe todos os seus registros de direitos autorais
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/')}
              style={{ height: '40px', paddingRight: '16px', paddingLeft: '16px' }}
            >
              + Novo Registro
            </button>
          </div>

          {MOCK_PEDIDOS.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 'var(--gap-grid)',
            }}>
              {MOCK_PEDIDOS.map((pedido) => (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  onViewDetails={() => alert(`Detalhes do pedido ${pedido.protocolo}`)}
                />
              ))}
            </div>
          ) : (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)',
              padding: 'var(--pad-card)',
              textAlign: 'center',
              paddingTop: '48px',
              paddingBottom: '48px',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600 }}>
                Nenhum registro ainda
              </h3>
              <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '14px', marginBottom: '24px' }}>
                Você ainda não tem pedidos de registro. Comece agora escolhendo um pacote.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                Fazer meu primeiro registro
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
