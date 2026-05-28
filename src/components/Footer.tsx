import React from 'react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: 'auto', paddingTop: 'var(--pad-section)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          paddingBottom: '48px',
          marginBottom: '32px',
          borderBottom: '1px solid var(--border)'
        }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--fg-muted)' }}>Produto</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#" style={{ color: 'var(--fg-faint)', fontSize: '14px' }}>Como funciona</a></li>
              <li><a href="#" style={{ color: 'var(--fg-faint)', fontSize: '14px' }}>Preços</a></li>
              <li><a href="#" style={{ color: 'var(--fg-faint)', fontSize: '14px' }}>Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--fg-muted)' }}>Empresa</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#" style={{ color: 'var(--fg-faint)', fontSize: '14px' }}>Sobre</a></li>
              <li><a href="#" style={{ color: 'var(--fg-faint)', fontSize: '14px' }}>Contato</a></li>
              <li><a href="#" style={{ color: 'var(--fg-faint)', fontSize: '14px' }}>Suporte</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--fg-muted)' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#" style={{ color: 'var(--fg-faint)', fontSize: '14px' }}>Termos de Serviço</a></li>
              <li><a href="#" style={{ color: 'var(--fg-faint)', fontSize: '14px' }}>Privacidade</a></li>
              <li><a href="#" style={{ color: 'var(--fg-faint)', fontSize: '14px' }}>Cookies</a></li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingBottom: '48px', color: 'var(--fg-faint)', fontSize: '13px' }}>
          <p style={{ margin: 0, marginBottom: '8px' }}>© 2026 Totalis. Todos os direitos reservados.</p>
          <p style={{ margin: 0 }}>Plataforma de Registro de Direitos Autorais</p>
        </div>
      </div>
    </footer>
  );
};
