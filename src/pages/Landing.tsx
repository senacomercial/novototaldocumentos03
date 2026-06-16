import React, { useState } from 'react';
import { CATEGORIES, PACOTES, BENEFICIOS, HOW, FAQ_DATA } from '../lib/data';
import { Icons } from '../components/Icons';
import { criarCheckout } from '../lib/checkout';
import { supabase } from '../lib/supabase';

interface LandingProps {
  navigate: (path: string, section?: string) => void;
  tweaks: { headline: string; headlineAccent: string };
}

export const Landing: React.FC<LandingProps> = ({ navigate, tweaks }) => {
  const [openFaq, setOpenFaq] = useState(0);
  const [loadingPacote, setLoadingPacote] = useState<string | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  async function handleComprar(pacote_id: string) {
    setLoadingPacote(pacote_id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        // Já logado → vai direto para o checkout
        const { checkout_url } = await criarCheckout(pacote_id, session.user.email);
        window.location.href = checkout_url;
      } else {
        // Não logado → salva pacote e redireciona para cadastro
        localStorage.setItem('pacote_pendente', pacote_id);
        navigate('/cadastro');
      }
    } catch (err) {
      console.error('Erro no checkout:', err);
      alert('Não foi possível iniciar o pagamento. Tente novamente em alguns instantes.');
    } finally {
      setLoadingPacote(null);
    }
  }

  return (
    <main style={{ flex: 1 }}>
      {/* ─── HERO ─── */}
      <section className="section" style={{ paddingTop: 80, paddingBottom: 60, position: 'relative', overflow: 'hidden' }}>
        <div className="glow-bg" />
        <div className="hero-shield-bg" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 820 }}>
            <div className="kicker fade-up">Registro de direitos autorais — 100% online</div>
            <h1 className="display fade-up" style={{ fontSize: 'clamp(40px, 6.5vw, 84px)', margin: '20px 0 0' }}>
              {tweaks.headline}<span className="accent">{tweaks.headlineAccent}</span>
            </h1>
            <p className="fade-up" style={{ fontSize: 19, color: 'var(--fg-muted)', maxWidth: 600, marginTop: 24, lineHeight: 1.5 }}>
              Registre sua obra com certificado digital, prova em blockchain e validade jurídica.
              Sem cartório, sem burocracia, sem sair de casa.
            </p>
            <div className="fade-up" style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => scrollTo('pacotes')}>
                Ver pacotes <Icons.ArrowRight width={18} height={18} />
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => scrollTo('como-funciona')}>
                Como funciona?
              </button>
            </div>
            <div className="fade-up" style={{ display: 'flex', gap: 28, marginTop: 44, flexWrap: 'wrap', color: 'var(--fg-faint)', fontSize: 13 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Icons.Check width={16} height={16} style={{ color: 'var(--success)' }} /> Em 24h
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Icons.Check width={16} height={16} style={{ color: 'var(--success)' }} /> Lei 9.610/98
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Icons.Check width={16} height={16} style={{ color: 'var(--success)' }} /> Pix, cartão, boleto
              </span>
            </div>
          </div>

          {/* Stats bar */}
          <div className="fade-up" style={{
            marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
            border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
            background: 'var(--bg-card)', overflow: 'hidden'
          }}>
            {[
              { k: '+12.480', l: 'Obras registradas' },
              { k: '16', l: 'Categorias de obra' },
              { k: '24h', l: 'Prazo médio de entrega' },
              { k: '180+', l: 'Países pela Conv. de Berna' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '24px 22px', borderLeft: i > 0 ? '1px solid var(--border)' : 'none' }}>
                <div className="display" style={{ fontSize: 28, lineHeight: 1, color: 'var(--accent-soft)' }}>{s.k}</div>
                <div style={{ marginTop: 8, fontSize: 13, color: 'var(--fg-muted)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIAS ─── */}
      <section className="section" id="categorias" style={{ paddingTop: 40 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div className="kicker">O que você pode registrar</div>
              <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: '14px 0 0', maxWidth: 600 }}>
                16 categorias para proteger <span className="accent">tudo que você cria</span>.
              </h2>
            </div>
            <p style={{ color: 'var(--fg-muted)', maxWidth: 380, fontSize: 15, margin: 0 }}>
              Da música ao código, do roteiro à planta arquitetônica. Se você criou, a gente registra.
            </p>
          </div>

          <div className="cat-grid">
            {CATEGORIES.map((cat) => {
              const IconComp = (Icons as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>)[cat.icon] || Icons.Text;
              return (
                <div key={cat.key} className="cat-card" onClick={() => scrollTo('pacotes')}>
                  <div className="icon-wrap"><IconComp /></div>
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-desc">{cat.desc}</div>
                  <div className="cat-arrow"><Icons.ArrowRight width={16} height={16} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─── */}
      <section className="section" id="como-funciona" style={{ background: 'var(--bg-elev)' }}>
        <div className="container">
          <div style={{ maxWidth: 720, marginBottom: 56 }}>
            <div className="kicker">Como funciona</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: '14px 0 0' }}>
              Do clique ao certificado em <span className="accent">4 passos</span>.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="how-grid">
            {HOW.map((s, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div className="step-num">{s.n}</div>
                <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .how-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 540px) { .how-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ─── O QUE ESTÁ INCLUSO ─── */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div className="kicker">O que está incluso</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: '14px 0 0', maxWidth: 760 }}>
              Tudo o que <span className="accent">um registro de verdade</span> precisa ter.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {BENEFICIOS.map((b, i) => {
              const IconComp = (Icons as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>)[b.icon] || Icons.Check;
              return (
                <div key={i} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 'var(--r-sm)',
                      display: 'grid', placeItems: 'center',
                      background: 'rgba(168, 85, 247, 0.10)',
                      color: 'var(--accent-soft)',
                      border: '1px solid var(--border-accent)',
                      flexShrink: 0,
                    }}>
                      <IconComp width={18} height={18} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>{b.title}</div>
                  </div>
                  <div style={{ color: 'var(--fg-muted)', fontSize: 14, lineHeight: 1.55 }}>{b.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PACOTES ─── */}
      <section className="section" id="pacotes" style={{ background: 'var(--bg-elev)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 700, height: 700,
            background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.10), transparent 60%)',
            filter: 'blur(40px)',
          }} />
        </div>
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="kicker" style={{ justifyContent: 'center' }}>Pacotes</div>
            <h2 className="display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', margin: '14px auto 0', maxWidth: 720 }}>
              Escolha quantos registros <span className="accent">você vai precisar</span>.
            </h2>
            <p style={{ color: 'var(--fg-muted)', maxWidth: 540, margin: '18px auto 0', fontSize: 16 }}>
              Pague uma vez e use os créditos quando quiser. Sem expiração, sem mensalidade.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, maxWidth: 1040, margin: '0 auto' }} className="price-grid">
            {PACOTES.map((p) => (
              <div key={p.id} className={`card price-card${p.featured ? ' featured' : ''}`}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{p.label}</div>
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 22, color: 'var(--fg-muted)' }}>R$</span>
                    <span className="price-num">{Math.floor(p.preco)}</span>
                    <span className="price-cents">,{(p.preco % 1).toFixed(2).slice(2)}</span>
                  </div>
                  <div className="price-period" style={{ marginTop: 6 }}>
                    Pagamento único · R$ {(p.preco / p.registros).toFixed(2).replace('.', ',')} por registro
                  </div>
                  {p.savings && (
                    <div style={{ marginTop: 10 }}>
                      <span className="badge accent">{p.savings}</span>
                    </div>
                  )}
                </div>
                <div style={{ height: 1, background: 'var(--border)' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {[
                    `${p.registros} registro${p.registros > 1 ? 's' : ''} em qualquer categoria`,
                    'Certificado digital + blockchain',
                    'Entrega em 24h',
                    'Acompanhamento por email e dashboard',
                  ].map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--fg-muted)' }}>
                      <Icons.Check width={16} height={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 3 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'} btn-lg`}
                  style={{ width: '100%', justifyContent: 'center', opacity: loadingPacote === p.id ? 0.7 : 1 }}
                  disabled={loadingPacote !== null}
                  onClick={() => handleComprar(p.id)}
                >
                  {loadingPacote === p.id ? 'Aguarde…' : <>Comprar agora <Icons.ArrowRight width={16} height={16} /></>}
                </button>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 32, color: 'var(--fg-faint)', fontSize: 13 }}>
            Pagamento processado pelo Mercado Pago · Pix, cartão (até 12x) ou boleto · Seu dinheiro de volta se não entregarmos no prazo
          </p>
        </div>
        <style>{`
          @media (max-width: 900px) { .price-grid { grid-template-columns: 1fr !important; max-width: 480px !important; } }
        `}</style>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section">
        <div className="container-narrow">
          <div style={{ marginBottom: 40 }}>
            <div className="kicker">Perguntas frequentes</div>
            <h2 className="display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', margin: '14px 0 0' }}>
              Antes de comprar, <span className="accent">tira aqui suas dúvidas</span>.
            </h2>
          </div>
          <div>
            {FAQ_DATA.map((f, i) => (
              <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <Icons.Plus className="chev" width={20} height={20} />
                </div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="section" style={{ paddingBottom: 80 }}>
        <div className="container">
          <div style={{
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--r-lg)',
            padding: '56px 48px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--bg-card), var(--bg-card-hi))',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)',
              width: 600, height: 400,
              background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.18), transparent 60%)',
              filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative' }}>
              <h2 className="display" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', margin: 0, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
                Sua obra merece <span className="accent">proteção de verdade</span>.
              </h2>
              <p style={{ color: 'var(--fg-muted)', maxWidth: 480, margin: '20px auto 32px', fontSize: 16 }}>
                Cinco minutos para registrar. Para sempre seu.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => scrollTo('pacotes')}>
                Começar agora <Icons.ArrowRight width={18} height={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
