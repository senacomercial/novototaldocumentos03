// Dashboard page — client area

const { useState: useStateD } = React;

function Dashboard({ navigate }) {
  const [selectedId, setSelectedId] = useStateD(MOCK_PEDIDOS[0].id);
  const selected = MOCK_PEDIDOS.find((p) => p.id === selectedId);

  return (
    <main className="section" style={{ paddingTop: 48, paddingBottom: 64 }}>
      <div className="container">
        {/* Header strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="kicker">Sua área Totalis</div>
            <h1 className="display" style={{ fontSize: 'clamp(32px, 4vw, 48px)', margin: '12px 0 6px' }}>
              Olá, <span className="accent">Marina</span>.
            </h1>
            <p className="text-muted" style={{ fontSize: 15, margin: 0 }}>
              Você tem <strong style={{ color: 'var(--fg)' }}>2 registros em andamento</strong> e <strong style={{ color: 'var(--fg)' }}>1 concluído</strong>.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/', 'pacotes')}>
            <Icon.Plus width="16" height="16" /> Novo registro
          </button>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }} className="dash-summary">
          {[
            { label: 'Em andamento', value: '2', accent: true },
            { label: 'Concluídos', value: '1' },
            { label: 'Créditos disponíveis', value: '0' },
            { label: 'Próximo prazo', value: '10 Dez', sub: '12 dias' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: 18 }}>
              <div style={{ fontSize: 12, color: 'var(--fg-faint)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
              <div className="display" style={{ fontSize: 30, margin: '6px 0 0', color: s.accent ? 'var(--accent-soft)' : 'var(--fg)' }}>{s.value}</div>
              {s.sub && <div style={{ fontSize: 12, color: 'var(--fg-faint)', marginTop: 2 }}>em {s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Two columns: list + detail */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 22 }} className="dash-grid">
          {/* List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>Meus pedidos</h2>
              <div className="badge">{MOCK_PEDIDOS.length} total</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MOCK_PEDIDOS.map((p) => {
                const meta = STATUS_META[p.status];
                const isActive = p.id === selectedId;
                return (
                  <div
                    key={p.id}
                    className="card order-card"
                    onClick={() => setSelectedId(p.id)}
                    style={{
                      borderColor: isActive ? 'var(--border-accent)' : 'var(--border)',
                      background: isActive ? 'var(--bg-card-hi)' : 'var(--bg-card)',
                    }}
                  >
                    <div>
                      <div className="protocol">{p.protocolo}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, margin: '6px 0 4px', letterSpacing: '-0.01em' }}>{p.titulo}</div>
                      <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{p.categoriaName} · pedido em {p.dataPedido}</div>
                      <div style={{ marginTop: 14 }}>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${p.progress}%` }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-faint)', marginTop: 6 }}>
                          <span>{p.progress}% concluído</span>
                          <span>prazo: {p.prazoEstimado}</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>Detalhes do pedido</h2>
            </div>
            <div className="card" style={{ padding: 28 }}>
              <div className="protocol">{selected.protocolo}</div>
              <h3 className="display" style={{ fontSize: 26, margin: '6px 0 4px', letterSpacing: '-0.01em' }}>{selected.titulo}</h3>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 10 }}>
                <span className="badge">{selected.categoriaName}</span>
                <StatusBadge status={selected.status} />
              </div>

              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pedido em</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{selected.dataPedido}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Prazo estimado</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{selected.prazoEstimado}</div>
                </div>
              </div>

              <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Linha do tempo
                </div>
                <div className="timeline">
                  {[
                    { title: 'Recebido', meta: `Pagamento confirmado · ${selected.dataPedido}`, state: 'done' },
                    { title: 'Em análise', meta: 'Validação dos arquivos e metadados', state: selected.status === 'EM_ANALISE' ? 'active' : (STATUS_META[selected.status].step > 1 ? 'done' : 'pending') },
                    { title: 'Em processamento', meta: 'Geração de certificado + registro em blockchain', state: selected.status === 'EM_PROCESSAMENTO' ? 'active' : (STATUS_META[selected.status].step > 2 ? 'done' : 'pending') },
                    { title: 'Concluído', meta: selected.status === 'CONCLUIDO' ? 'Certificado disponível para download' : `Previsto para ${selected.prazoEstimado}`, state: selected.status === 'CONCLUIDO' ? 'done' : 'pending' },
                  ].map((row, i, arr) => (
                    <div key={i} className="timeline-row">
                      <div>
                        <div className={`timeline-dot ${row.state}`}></div>
                        {i < arr.length - 1 && <div className={`timeline-line ${row.state === 'done' ? 'done' : ''}`}></div>}
                      </div>
                      <div>
                        <div className="timeline-title" style={{ color: row.state === 'pending' ? 'var(--fg-faint)' : 'var(--fg)' }}>{row.title}</div>
                        <div className="timeline-meta">{row.meta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selected.certificado && (
                <div style={{ marginTop: 24, padding: 16, borderRadius: 'var(--r-sm)',
                  background: 'rgba(52, 211, 153, 0.06)', border: '1px solid rgba(52, 211, 153, 0.25)',
                  display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Icon.Shield width="22" height="22" style={{ color: 'var(--success)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Seu certificado está pronto</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>PDF assinado digitalmente + recibo blockchain</div>
                  </div>
                  <button className="btn btn-primary btn-sm">
                    <Icon.Download width="14" height="14" /> Baixar
                  </button>
                </div>
              )}

              {selected.status !== 'CONCLUIDO' && (
                <div style={{ marginTop: 24, padding: 16, borderRadius: 'var(--r-sm)',
                  background: 'rgba(168, 85, 247, 0.06)', border: '1px solid var(--border-accent)',
                  display: 'flex', alignItems: 'start', gap: 14 }}>
                  <Icon.Mail width="20" height="20" style={{ color: 'var(--accent-soft)', marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Você será avisada por email</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
                      A cada mudança de status enviamos uma notificação para marina@email.com
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .dash-summary { grid-template-columns: repeat(2, 1fr) !important; }
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

window.Dashboard = Dashboard;
