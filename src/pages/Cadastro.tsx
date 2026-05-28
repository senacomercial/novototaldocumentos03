import React, { useState } from 'react';
import { signUp } from '../lib/auth';

interface CadastroProps {
  navigate: (path: string, section?: string) => void;
  onLogin: () => void;
}

export const Cadastro: React.FC<CadastroProps> = ({ navigate, onLogin }) => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const result = await signUp(email, password, nomeCompleto);
      if (result.session) {
        onLogin();
        navigate('/dashboard');
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
          padding: '40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '22px' }}>Confirme seu e-mail</h2>
          <p style={{ color: 'var(--fg-muted)', fontSize: '14px', lineHeight: 1.6 }}>
            Enviamos um link de confirmação para <strong>{email}</strong>. Acesse seu e-mail e clique no link para ativar sua conta.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/login')}
            style={{ marginTop: '24px', height: '40px', width: '100%' }}
          >
            Ir para o Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        padding: '40px',
      }}>
        <h1 className="display" style={{ fontSize: '28px', marginBottom: '8px' }}>Criar conta</h1>
        <p style={{ color: 'var(--fg-muted)', fontSize: '14px', marginBottom: '32px' }}>
          Comece a proteger suas obras hoje
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Nome completo
            </label>
            <input
              type="text"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              required
              placeholder="Seu nome"
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--fg)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--fg)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--fg)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ height: '44px', marginTop: '8px' }}
          >
            {loading ? 'Criando conta…' : 'Criar conta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--fg-muted)', marginTop: '24px' }}>
          Já tem conta?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-soft)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, padding: 0 }}
          >
            Entrar
          </button>
        </p>
      </div>
    </main>
  );
};
