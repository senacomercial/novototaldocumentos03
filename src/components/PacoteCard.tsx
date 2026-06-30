import React from 'react';
import { Pacote } from '../types';

interface PacoteCardProps {
  pacote: Pacote;
  onSelect: () => void;
}

export const PacoteCard: React.FC<PacoteCardProps> = ({ pacote, onSelect }) => {
  return (
    <div style={{
      background: pacote.featured ? 'var(--bg-card-hi)' : 'var(--bg-card)',
      border: `2px solid ${pacote.featured ? 'var(--border-accent)' : 'var(--border)'}`,
      borderRadius: 'var(--r-md)',
      padding: 'var(--pad-card)',
      position: 'relative',
      transition: 'all 200ms ease-out',
    }}>
      {pacote.featured && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(90deg, var(--accent-soft), var(--accent-deep))',
          color: 'white',
          padding: '4px 12px',
          borderRadius: 'var(--r-pill)',
          fontSize: '12px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          Mais Popular
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700 }}>
          {pacote.label}
        </h3>
        <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: '13px' }}>
          {pacote.registros} {pacote.registros === 1 ? 'registro' : 'registros'}
        </p>
      </div>

      {pacote.savings && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          color: 'var(--success)',
          padding: '8px 12px',
          borderRadius: 'var(--r-sm)',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '16px',
        }}>
          {pacote.savings}
        </div>
      )}

      <p style={{ margin: '0 0 24px', color: 'var(--fg-muted)', fontSize: '14px' }}>
        {pacote.desc}
      </p>

      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '28px', fontWeight: 700 }}>
          R$ {pacote.preco.toFixed(2).replace('.', ',')}
        </span>
        {pacote.registros > 1 && (
          <span style={{ fontSize: '12px', color: 'var(--fg-muted)', marginLeft: '8px' }}>
            R$ {(pacote.preco / pacote.registros).toFixed(2).replace('.', ',')} por registro
          </span>
        )}
      </div>

      <button
        className={`btn ${pacote.featured ? 'btn-primary' : 'btn-secondary'}`}
        onClick={onSelect}
        style={{ width: '100%' }}
      >
        Escolher Plano
      </button>
    </div>
  );
};
