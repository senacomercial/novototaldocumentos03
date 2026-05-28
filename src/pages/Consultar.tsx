import React, { useState } from 'react';
import { MOCK_PEDIDOS } from '../lib/data';
import { Pedido, Status } from '../types';

interface ConsultarProps {
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

export const Consultar: React.FC<ConsultarProps> = ({ navigate }) => {
  const [protocolo, setProtocolo] = useState('');
  const [resultado, setResultado] = useState<Pedido | null>(null);
  const [buscado, setBuscado] = useState(false);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setBuscado(true);

    const encontrado = MOCK_PEDIDOS.find(
      (p) => p.protocolo.toUpperCase() === protocolo.toUpperCase()
    );

    if (encontrado) {
      setResultado(encontrado);
    } else {
      setResultado(null);
    }
  };

  return (
    <main style={{ flex: 1 }}>
      <section style={{
        paddingTop: 'calc(var(--pad-section) * 1.5)',
        paddingBottom: 'var(--pad-section)',
        background: `linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)`,
      }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <h1 className="display" style={{ marginBottom: '24px', fontSize: '48px' }}>
            Consultar Registro
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--fg-muted)', marginBottom: '48px', lineHeight: 1.6 }}>
            Digite o número do protocolo para ver o status do seu registro ou de qualquer obra registrada na plataforma.
          </p>

          <form onSubmit={handleBuscar} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={protocolo}
                onChange={(e) => setProtocolo(e.target.value)}
                placeholder="Ex: TOT-202611-04823"
                style={{
                  flex: 1,
                  padding: 'var(--pad-sm)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  fontSize: '14px',
                  background: 'var(--bg-card)',
                  color: 'var(--fg)',
                }}
              />
              <button type="submit" className="btn btn-primary">
                Buscar
              </button>
            </div>
          </form>
        </div>
      </section>

      <section style={{ paddingTop: 'var(--pad-section)', paddingBottom: 'var(--pad-section)' }}>
        <div className="container-narrow">
          {buscado && !resultado && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--r-md)',
              padding: 'var(--pad-card)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600 }}>
                Protocolo não encontrado
              </h3>
              <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '14px' }}>
                Verifique o número do protocolo e tente novamente. Se não conseguir encontrar, entre em contato com nosso suporte.
              </p>
            </div>
          )}

          {resultado && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)',
              padding: 'var(--pad-card)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 700 }}>
                    {resultado.titulo}
                  </h2>
                  <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '14px' }}>
                    {resultado.categoriaName}
                  </p>
                </div>
                <div style={{
                  background: getStatusColor(resultado.status),
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: 'var(--r-sm)',
                  fontSize: '14px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                  {getStatusLabel(resultado.status)}
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--fg-muted)', fontWeight: 600 }}>PROGRESSO DO REGISTRO</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{resultado.progress}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--border)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${resultado.progress}%`,
                    background: `linear-gradient(90deg, var(--accent-soft), var(--accent-deep))`,
                  }} />
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                paddingTop: '24px',
                borderTop: '1px solid var(--border)',
              }}>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--fg-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Protocolo
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                    {resultado.protocolo}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--fg-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Data do Pedido
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                    {resultado.dataPedido}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--fg-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Prazo Estimado
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                    {resultado.prazoEstimado}
                  </div>
                </div>
              </div>

              {resultado.certificado && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid #10b981',
                  borderRadius: 'var(--r-md)',
                  padding: 'var(--pad-card)',
                  marginTop: '24px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>✅</div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600, color: '#10b981' }}>
                    Registro Concluído!
                  </h3>
                  <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '13px' }}>
                    Seu certificado está pronto para download
                  </p>
                </div>
              )}
            </div>
          )}

          {!buscado && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)',
              padding: 'var(--pad-card)',
              textAlign: 'center',
              paddingTop: '48px',
              paddingBottom: '48px',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 600 }}>
                Digite um protocolo para consultar
              </h3>
              <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '13px' }}>
                A busca é pública e funciona para qualquer registro feito na plataforma.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
