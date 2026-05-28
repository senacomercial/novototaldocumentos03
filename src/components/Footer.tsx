import React from 'react';
import { LogoWordmark } from './Icons';

interface FooterProps {
  navigate: (path: string, section?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: 14 }}><LogoWordmark size={26} /></div>
            <p style={{ color: 'var(--fg-muted)', maxWidth: 320, lineHeight: 1.55, margin: 0 }}>
              Registro de direitos autorais com certificação digital e prova em blockchain. Uma marca Total Documentos.
            </p>
          </div>
          <div>
            <h5>Plataforma</h5>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Como funciona</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/', 'pacotes'); }}>Pacotes</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/consultar'); }}>Consultar protocolo</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Acessar conta</a></li>
            </ul>
          </div>
          <div>
            <h5>Ajuda</h5>
            <ul>
              <li><a href="#">Central de ajuda</a></li>
              <li><a href="#">Falar conosco</a></li>
              <li><a href="#">WhatsApp</a></li>
              <li><a href="#">Status do sistema</a></li>
            </ul>
          </div>
          <div>
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Termos de uso</a></li>
              <li><a href="#">Privacidade</a></li>
              <li><a href="#">Lei de Direitos Autorais</a></li>
              <li><a href="#">LGPD</a></li>
            </ul>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 12 }}>
          <div>© 2026 Totalis · Total Documentos · CNPJ 00.000.000/0001-00</div>
          <div style={{ display: 'flex', gap: 18 }}>
            <span>Pagamentos via Mercado Pago</span>
            <span>·</span>
            <span>Site seguro SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
