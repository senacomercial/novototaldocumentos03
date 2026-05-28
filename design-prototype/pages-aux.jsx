// Consultar (public protocol search) + Login + Obrigado pages

const { useState: useStateC, useEffect: useEffectC } = React;

// ─── Consultar ───
function Consultar({ navigate }) {
  const [query, setQuery] = useStateC('');
  const [result, setResult] = useStateC(null);
  const [loading, setLoading] = useStateC(false);
  const [notFound, setNotFound] = useStateC(false);

  function search(e) {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    setTimeout(() => {
      const found = MOCK_PEDIDOS.find((p) => p.protocolo.toLowerCase() === query.trim().toLowerCase());
      if (found) setResult(found); else setNotFound(true);
      setLoading(false);
    }, 600);
  }

  return (
    <main className="section" style={{ paddingTop: 80, paddingBottom: 96, position: 'relative', overflow: 'hidden' }}>
      <div className="glow-bg"></div>
      <div className="container-narrow" style={{ position: 'relative', zIndex: 1 }}>
        <div className="kicker">Consulta pública</div>
        <h1 className="display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', margin: '14px 0 0' }}>
          Verifique um <span className="accent">registro Totalis</span>.
        </h1>
        <p className="text-muted" style={{ fontSize: 17, marginTop: 18, maxWidth: 560 }}>
          Digite o número do protocolo (ex: <code style={{ color: 'var(--fg)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>TOT-202611-04823</code>) e veja o status atual do registro. Sem login.
        </p>

        <form onSubmit={search} style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Icon.Search width="18" height="18" style={{ position: 'absolute', left: 16, top: 15, color: 'var(--fg-faint)' }} />
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              placeholder="TOT-XXXXXX-XXXXX"
              style={{ paddingLeft: 46, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Buscando…' : <>Consultar <Icon.ArrowRight width="16" height="16" /></>}
          </button>
        </form>

        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--fg-faint)' }}>
          Experimente: <button type="button" onClick={() => { setQuery('TOT-202609-03991'); setTimeout(() => search(), 50); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-soft)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, padding: 0 }}>
            TOT-202609-03991
          </button> (concluído) · ou <button type="button" onClick={() => { setQuery('TOT-202611-04823'); setTimeout(() => search(), 50); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-soft)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 12, padding: 0 }}>
            TOT-202611-04823
          </button> (em andamento)
        </div>

        {/* Result */}
        {result && (
          <div className="card fade-up" style={{ marginTop: 36, padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div className="protocol">{result.protocolo}</div>
                <h2 className="display" style={{ fontSize: 26, margin: '6px 0 8px', letterSpacing: '-0.01em' }}>{result.titulo}</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="badge">{result.categoriaName}</span>
                  <StatusBadge status={result.status} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pedido em</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{result.dataPedido}</div>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 22, borderTop: '1px solid var(--border)' }}>
              <div className="timeline">
                {[
                  { title: 'Recebido', state: 'done' },
                  { title: 'Em análise', state: STATUS_META[result.status].step >= 1 ? (result.status === 'EM_ANALISE' ? 'active' : 'done') : 'pending' },
                  { title: 'Em processamento', state: STATUS_META[result.status].step >= 2 ? (result.status === 'EM_PROCESSAMENTO' ? 'active' : 'done') : 'pending' },
                  { title: 'Concluído', state: result.status === 'CONCLUIDO' ? 'done' : 'pending' },
                ].map((row, i, arr) => (
                  <div key={i} className="timeline-row">
                    <div>
                      <div className={`timeline-dot ${row.state}`}></div>
                      {i < arr.length - 1 && <div className={`timeline-line ${row.state === 'done' ? 'done' : ''}`}></div>}
                    </div>
                    <div>
                      <div className="timeline-title" style={{ color: row.state === 'pending' ? 'var(--fg-faint)' : 'var(--fg)' }}>{row.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {result.status === 'CONCLUIDO' && (
              <div style={{ marginTop: 22, padding: 16, borderRadius: 'var(--r-sm)',
                background: 'rgba(52, 211, 153, 0.06)', border: '1px solid rgba(52, 211, 153, 0.25)',
                display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <Icon.Shield width="22" height="22" style={{ color: 'var(--success)' }} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Registro autêntico</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
                    Hash blockchain: <span style={{ fontFamily: 'var(--font-mono)' }}>0x8f3a…b21c</span>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm">Ver no explorer</button>
              </div>
            )}
          </div>
        )}

        {notFound && (
          <div className="card fade-up" style={{ marginTop: 36, padding: 28, borderColor: 'rgba(248, 113, 113, 0.3)' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--r-sm)',
                background: 'rgba(248, 113, 113, 0.10)', color: 'var(--danger)',
                display: 'grid', placeItems: 'center', flexShrink: 0
              }}>!</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Protocolo não encontrado</div>
                <div style={{ color: 'var(--fg-muted)', fontSize: 14, marginTop: 6 }}>
                  Confira se digitou corretamente. O formato é <span style={{ fontFamily: 'var(--font-mono)' }}>TOT-AAAAMM-XXXXX</span>.
                </div>
              </div>
            </div>
          </div>
        )}

        {!result && !notFound && (
          <div style={{
            marginTop: 48, padding: '28px 0', borderTop: '1px solid var(--border)',
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28
          }} className="consult-info">
            {[
              { icon: 'Shield', t: 'Verificação independente', d: 'Qualquer pessoa pode confirmar a existência de um registro.' },
              { icon: 'Chain', t: 'Prova em blockchain', d: 'Hash imutável publicado em rede pública.' },
              { icon: 'Clock', t: 'Histórico completo', d: 'Veja exatamente quando cada etapa foi concluída.' },
            ].map((info, i) => {
              const I = Icon[info.icon];
              return (
                <div key={i}>
                  <I width="20" height="20" style={{ color: 'var(--accent-soft)' }} />
                  <div style={{ fontWeight: 600, fontSize: 14, marginTop: 10 }}>{info.t}</div>
                  <div style={{ color: 'var(--fg-muted)', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{info.d}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 720px) { .consult-info { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}

// ─── Login ───
function Login({ navigate, doLogin }) {
  const [email, setEmail] = useStateC('marina@email.com');
  const [senha, setSenha] = useStateC('••••••••');

  function submit(e) {
    e.preventDefault();
    doLogin();
    navigate('/dashboard');
  }

  return (
    <main style={{ minHeight: 'calc(100vh - 200px)', display: 'grid', placeItems: 'center', padding: '60px 24px', position: 'relative', overflow: 'hidden' }}>
      <div className="glow-bg"></div>
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <LogoMark size={56} />
        </div>
        <div className="card" style={{ padding: 36 }}>
          <h1 className="display" style={{ fontSize: 28, margin: 0, letterSpacing: '-0.02em' }}>
            Acessar sua <span className="accent">conta</span>
          </h1>
          <p className="text-muted" style={{ fontSize: 14, marginTop: 8, marginBottom: 28 }}>
            Use o email cadastrado no momento da compra.
          </p>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginTop: 6 }} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Senha</label>
                <a href="#" style={{ fontSize: 12, color: 'var(--accent-soft)' }}>Esqueci a senha</a>
              </div>
              <input className="input" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} style={{ marginTop: 6 }} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              Entrar <Icon.ArrowRight width="16" height="16" />
            </button>
          </form>
          <div style={{ marginTop: 24, padding: 14, borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--fg-muted)', textAlign: 'center' }}>
            Ainda não comprou? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/', 'pacotes'); }} style={{ color: 'var(--accent-soft)', fontWeight: 600 }}>Ver pacotes</a>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: 'var(--fg-faint)' }}>
          Primeira vez? Verifique seu email — enviamos o link para você criar sua senha.
        </div>
      </div>
    </main>
  );
}

// ─── Obrigado (post-payment) ───
function Obrigado({ navigate, payload }) {
  const pacote = payload?.pacote || PACOTES[1];
  const fakeProtocol = 'TOT-202611-' + String(Math.floor(Math.random() * 90000) + 10000);

  return (
    <main style={{ minHeight: 'calc(100vh - 200px)', display: 'grid', placeItems: 'center', padding: '60px 24px', position: 'relative', overflow: 'hidden' }}>
      <div className="glow-bg"></div>
      <div className="container-narrow" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, margin: '0 auto 28px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,211,153,0.20), transparent 70%)',
          display: 'grid', placeItems: 'center'
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.4)',
            display: 'grid', placeItems: 'center', color: 'var(--success)'
          }}>
            <Icon.Check width="28" height="28" />
          </div>
        </div>
        <div className="kicker" style={{ justifyContent: 'center', color: 'var(--success)' }}>Pagamento confirmado</div>
        <h1 className="display" style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', margin: '14px 0 0' }}>
          Pronto, <span className="accent">é seu</span>.
        </h1>
        <p className="text-muted" style={{ fontSize: 17, maxWidth: 560, margin: '20px auto 36px' }}>
          Seu pedido foi recebido e já estamos cuidando dele. Em instantes você receberá um email com o link para definir sua senha e enviar sua obra.
        </p>

        <div className="card" style={{ padding: 28, textAlign: 'left', maxWidth: 520, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Protocolo</div>
              <div className="protocol" style={{ fontSize: 16, marginTop: 4, color: 'var(--fg)' }}>{fakeProtocol}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard?.writeText(fakeProtocol)}>Copiar</button>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pacote</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{pacote.label}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valor pago</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>R$ {pacote.preco.toFixed(2).replace('.', ',')}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Créditos</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{pacote.registros} registro(s)</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--fg-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Prazo</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>20 dias úteis</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 36, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
            Acessar minha conta <Icon.ArrowRight width="16" height="16" />
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/consultar')}>
            Consultar protocolo
          </button>
        </div>

        <div style={{ marginTop: 36, color: 'var(--fg-faint)', fontSize: 13 }}>
          Verifique sua caixa de entrada e a pasta de spam. Não recebeu? <a href="#" style={{ color: 'var(--accent-soft)' }}>Reenviar email</a>
        </div>
      </div>
    </main>
  );
}

window.Consultar = Consultar;
window.Login = Login;
window.Obrigado = Obrigado;
