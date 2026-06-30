import React from 'react';
import { CategoryInfo } from '../types';

interface CategoryCardProps {
  category: CategoryInfo;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        padding: 'var(--pad-card)',
        cursor: 'pointer',
        transition: 'all 200ms ease-out',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
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
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: 'var(--r-sm)',
        background: 'linear-gradient(135deg, var(--accent-soft), var(--accent-deep))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: 'white',
      }}>
        📦
      </div>
      <div style={{ textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 600 }}>{category.name}</h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--fg-muted)', lineHeight: 1.4 }}>{category.desc}</p>
      </div>
    </button>
  );
};
