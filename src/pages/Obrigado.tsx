import React, { useEffect, useState } from 'react';
import { Icons } from '../components/Icons';

interface ObrigadoProps {
  navigate: (path: string, section?: string) => void;
}

export const Obrigado: React.FC<ObrigadoProps> = ({ navigate }) => {
  const [protocolo, setProtocolo] = useState<string | null>(null);

  useEffect(() => {
    // MP passa payment_id na query string: ?payment_id=xxx&status=approved
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const extRef = params.get('external_reference');
    if (status === 'approved' && extRef) {
      // protocolo real vem via email; aqui só confirmamos o pacote comprado
      setProtocolo(extRef);
    }
  }, []);

  return (
    <main style={{ flex: 1 }}>
      <section className="section" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="container-narrow" style={{ textAlign: 'center', maxWidth: 600 }}>

          {/* Ícone de sucesso */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(52, 211, 153, 0.12)',
            border: '2px solid rgba(52, 211, 153, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 32px',
          }}>
            <Icons.Check width={36} height={36} style={{ color: 'var(--success)' }} />
          </div>

          <div className="kicker" style={{ justifyContent: 'center', marginBottom: 16 }}>
            Pagamento aprovado
          </div>
          <h1 className="display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', margin: '0 0 16px' }}>
            Pedido recebido com <span className="accent">sucesso!</span>
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: 16, lineHeight: 1.6, margin: '0 0 40px' }}>
            Confira seu email — enviamos o protocolo do pedido e o link para acessar sua área em instantes.
          </p>

          {/* Próximos passos */}
          <div className="card" style={{ textAlign: 'left', marginBottom: 32 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>O que acontece agora?</h3>
            {[
              { icon: 'Mail',      text: 'Você receberá um email com seu protocolo único e link de acesso' },
              { icon: 'ArrowRight',text: 'Clique no link do email para entrar direto na sua área (sem senha)' },
              { icon: 'Upload',    text: 'No dashboard, envie o arquivo da obra que quer registrar' },
              { icon: 'Clock',     text: 'Em 24h seu certificado fica disponível para download' },
            ].map((step, i) => {
              const IconComp = (Icons as Record<string, React.FC<React.SVGProps<SVGSVGElement>>>)[step.icon] ?? Icons.Check;
              return (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 3 ? 16 : 0, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--r-sm)',
                    background: 'rgba(168, 85, 247, 0.10)',
                    border: '1px solid var(--border-accent)',
                    display: 'grid', placeItems: 'center',
                    color: 'var(--accent-soft)', flexShrink: 0,
                  }}>
                    <IconComp width={15} height={15} />
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.5, paddingTop: 6 }}>
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Aviso spam */}
          <div style={{
            background: 'rgba(251, 191, 36, 0.06)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            borderRadius: 'var(--r-md)',
            padding: '14px 18px',
            fontSize: 13,
            color: 'var(--fg-muted)',
            marginBottom: 40,
            textAlign: 'left',
          }}>
            <strong style={{ color: 'var(--warning)' }}>Não recebeu o email?</strong>{' '}
            Verifique a caixa de spam. Se não encontrar, entre em contato com nosso suporte.
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
              Acessar minha área <Icons.ArrowRight width={16} height={16} />
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/consultar')}>
              Consultar protocolo
            </button>
          </div>

        </div>
      </section>
    </main>
  );
};
