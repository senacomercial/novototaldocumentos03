import React, { useState } from 'react';
import { CATEGORIES, PACOTES, BENEFICIOS, HOW, FAQ_DATA } from '../lib/data';
import { Tweaks } from '../types';
import { CategoryCard } from '../components/CategoryCard';
import { PacoteCard } from '../components/PacoteCard';

interface LandingProps {
  navigate: (path: string) => void;
  tweaks: Tweaks;
}

export const Landing: React.FC<LandingProps> = ({ navigate, tweaks }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <main style={{ flex: 1 }}>
      {/* Hero */}
      <section style={{
        paddingTop: 'calc(var(--pad-section) * 1.5)',
        paddingBottom: 'var(--pad-section)',
        background: `linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)`,
      }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <h1 className="display" style={{ marginBottom: '24px', fontSize: '48px' }}>
            {tweaks.headline}
            <span className="accent">{tweaks.headlineAccent}</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--fg-muted)', marginBottom: '48px', lineHeight: 1.6 }}>
            Registre suas obras intelectuais com segurança jurídica. Certificado oficial, prova em blockchain, e suporte de especialistas em direito autoral.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                const pacotesEl = document.getElementById('pacotes');
                pacotesEl?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Ver Pacotes
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/consultar')}
            >
              Consultar Registro
            </button>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section style={{ paddingTop: 'var(--pad-section)', paddingBottom: 'var(--pad-section)' }}>
        <div className="container">
          <h2 className="display" style={{ textAlign: 'center', marginBottom: '48px', fontSize: '32px' }}>
            O que registramos?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 'var(--gap-grid)',
          }}>
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.key}
                category={cat}
                onClick={() => navigate('/login')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section style={{
        paddingTop: 'var(--pad-section)',
        paddingBottom: 'var(--pad-section)',
        background: 'var(--bg-card)',
      }}>
        <div className="container">
          <h2 className="display" style={{ textAlign: 'center', marginBottom: '48px', fontSize: '32px' }}>
            Como funciona?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
          }}>
            {HOW.map((step) => (
              <div key={step.n} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--r-sm)',
                  background: 'linear-gradient(135deg, var(--accent-soft), var(--accent-deep))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '18px',
                }}>
                  {step.n}
                </div>
                <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 600 }}>{step.title}</h3>
                <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section style={{ paddingTop: 'var(--pad-section)', paddingBottom: 'var(--pad-section)' }}>
        <div className="container">
          <h2 className="display" style={{ textAlign: 'center', marginBottom: '48px', fontSize: '32px' }}>
            O que está incluso?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--gap-grid)',
          }}>
            {BENEFICIOS.map((ben, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)',
                padding: 'var(--pad-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--r-sm)',
                  background: 'rgba(168, 85, 247, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  fontSize: '20px',
                }}>
                  {ben.icon === 'Shield' && '🛡️'}
                  {ben.icon === 'Chain' && '⛓️'}
                  {ben.icon === 'Bolt' && '⚡'}
                  {ben.icon === 'Clock' && '⏱️'}
                  {ben.icon === 'Mail' && '📧'}
                  {ben.icon === 'Download' && '⬇️'}
                  {ben.icon === 'Search' && '🔍'}
                </div>
                <h3 style={{ margin: '0', fontSize: '15px', fontWeight: 600 }}>{ben.title}</h3>
                <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '13px', lineHeight: 1.5 }}>
                  {ben.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pacotes */}
      <section id="pacotes" style={{ paddingTop: 'var(--pad-section)', paddingBottom: 'var(--pad-section)', background: 'var(--bg-card)' }}>
        <div className="container-narrow">
          <h2 className="display" style={{ textAlign: 'center', marginBottom: '48px', fontSize: '32px' }}>
            Escolha seu plano
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {PACOTES.map((pacote) => (
              <PacoteCard
                key={pacote.id}
                pacote={pacote}
                onSelect={() => window.location.href = 'https://mercadopago.com'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ paddingTop: 'var(--pad-section)', paddingBottom: 'var(--pad-section)' }}>
        <div className="container-narrow">
          <h2 className="display" style={{ textAlign: 'center', marginBottom: '48px', fontSize: '32px' }}>
            Perguntas frequentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQ_DATA.map((faq, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: 'var(--pad-card)',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 600 }}>{faq.q}</span>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>
                    {expandedFAQ === idx ? '−' : '+'}
                  </span>
                </button>
                {expandedFAQ === idx && (
                  <div style={{
                    padding: '0 var(--pad-card) var(--pad-card)',
                    color: 'var(--fg-muted)',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    borderTop: '1px solid var(--border)',
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
