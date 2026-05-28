import React from 'react';

interface HeaderProps {
  route: string;
  navigate: (path: string) => void;
  loggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({ route, navigate, loggedIn }) => {
  return (
    <header className="header">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
        <button
          className="logo-btn"
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2L35 8V20L20 32L5 20V8L20 2Z" fill="url(#grad)" stroke="var(--accent)" strokeWidth="1.5"/>
            <defs>
              <linearGradient id="grad" x1="20" y1="2" x2="20" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="var(--accent-soft)"/>
                <stop offset="100%" stopColor="var(--accent-deep)"/>
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.01em' }}>Totalis</span>
        </button>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {!loggedIn && route !== '/login' && (
            <button
              className="btn-secondary"
              onClick={() => navigate('/login')}
              style={{ height: '40px', paddingRight: '16px', paddingLeft: '16px' }}
            >
              Entrar
            </button>
          )}
          {loggedIn && (
            <button
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
              style={{ height: '40px', paddingRight: '16px', paddingLeft: '16px' }}
            >
              Minha Área
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
