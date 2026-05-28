import React from 'react';
import { LogoWordmark, Icons } from './Icons';

interface HeaderProps {
  route: string;
  navigate: (path: string, section?: string) => void;
  loggedIn: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ route, navigate, loggedIn, onLogout }) => {
  const scrollTo = (id: string) => {
    if (route !== '/') {
      navigate('/', id);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <LogoWordmark size={28} />
        </div>

        <nav className="nav-links hide-mobile">
          <a href="#categorias" onClick={(e) => { e.preventDefault(); scrollTo('categorias'); }}>Categorias</a>
          <a href="#como-funciona" onClick={(e) => { e.preventDefault(); scrollTo('como-funciona'); }}>Como funciona</a>
          <a href="#pacotes" onClick={(e) => { e.preventDefault(); scrollTo('pacotes'); }}>Pacotes</a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate('/consultar'); }}
            className={route === '/consultar' ? 'active' : ''}
          >
            Consultar protocolo
          </a>
        </nav>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {loggedIn ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}>
                <Icons.User width={16} height={16} /> Meus pedidos
              </button>
              {onLogout && (
                <button className="btn btn-ghost btn-sm" onClick={onLogout} style={{ opacity: 0.7 }}>
                  <Icons.LogOut width={16} height={16} />
                </button>
              )}
            </>
          ) : (
            <button className="btn btn-ghost btn-sm hide-mobile" onClick={() => navigate('/login')}>
              Entrar
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => scrollTo('pacotes')}>
            Registrar agora
          </button>
        </div>
      </div>
    </header>
  );
};
