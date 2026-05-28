import React from 'react';

interface ObrigadoProps {
  navigate: (path: string, section?: string) => void;
}

export const Obrigado: React.FC<ObrigadoProps> = ({ navigate }) => {
  return (
    <main style={{ flex: 1 }}>
      <section style={{
        paddingTop: 'calc(var(--pad-section) * 2)',
        paddingBottom: 'calc(var(--pad-section) * 2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '80px', marginBottom: '32px', animation: 'fadeInScale 0.6s ease-out' }}>
            ✅
          </div>

          <h1 className="display" style={{ marginBottom: '16px', fontSize: '48px' }}>
            Obrigado! Pagamento Confirmado
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--fg-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
            Seu pedido foi recebido com sucesso. Confira seu email para:
          </p>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 48px',
            fontSize: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center',
          }}>
            <li>📧 Número do protocolo único</li>
            <li>🔗 Link para acessar sua área logada</li>
            <li>📋 Instruções para enviar sua obra</li>
            <li>📅 Prazo estimado de conclusão</li>
          </ul>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            padding: 'var(--pad-card)',
            marginBottom: '48px',
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 600 }}>
              Próximos passos:
            </h3>
            <ol style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: '14px',
              color: 'var(--fg-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              <li>Verifique o email cadastrado na compra</li>
              <li>Clique no link para definir sua senha</li>
              <li>Acesse a área logada com suas credenciais</li>
              <li>Faça upload de sua obra no dashboard</li>
              <li>Acompanhe o progresso do registro</li>
            </ol>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/dashboard')}
            >
              Ir para Minha Área
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Voltar para Home
            </button>
          </div>

          <div style={{
            marginTop: '48px',
            padding: '24px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            fontSize: '13px',
            color: 'var(--fg-muted)',
          }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>💬 Dúvidas?</p>
            <p style={{ margin: 0 }}>
              Se não receber o email em breve, verifique a pasta de spam ou entre em contato com nosso suporte.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
