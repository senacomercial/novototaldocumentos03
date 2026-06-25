import React, { useState, useEffect } from 'react';
import { updatePassword } from '../lib/auth';
import { supabase } from '../lib/supabase';

interface ResetPasswordConfirmProps {
  navigate: (path: string, section?: string) => void;
}

export const ResetPasswordConfirm: React.FC<ResetPasswordConfirmProps> = ({ navigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const tryExchangeCode = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      // Tenta trocar o code PKCE se existir
      if (code) {
        const { error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeErr) {
          // Ignora erro de PKCE — o evento PASSWORD_RECOVERY do App.tsx
          // já estabelece a sessão; apenas aguarda abaixo
        }
      }

      // Aguarda sessão ficar disponível (até 6 segundos)
      for (let i = 0; i < 20; i++) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          if (mounted) setIsReady(true);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      if (mounted) setError('Sessão expirada. Solicite um novo link de recuperação.');
    };

    // Também escuta o evento PASSWORD_RECOVERY como fallback
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session && mounted) {
        setIsReady(true);
      }
    });

    tryExchangeCode();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não correspondem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setMessage('✅ Senha redefinida com sucesso! Redirecionando...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  }

  if (!isReady && !error) {
    return (
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
        <p style={{ color: 'var(--fg-muted)' }}>Verificando link…</p>
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
        <h1 className="display" style={{ fontSize: '28px', marginBottom: '8px' }}>
          Definir Nova Senha
        </h1>
        <p style={{ color: 'var(--fg-muted)', fontSize: '14px', marginBottom: '32px' }}>
          Crie uma nova senha para sua conta
        </p>

        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Nova Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
              disabled={!isReady}
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
                opacity: isReady ? 1 : 0.5,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirme sua senha"
              disabled={!isReady}
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
                opacity: isReady ? 1 : 0.5,
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>
          )}
          {message && (
            <p style={{ color: '#10b981', fontSize: '13px', margin: 0 }}>{message}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !isReady}
            style={{ height: '44px', marginTop: '8px' }}
          >
            {loading ? 'Processando…' : 'Redefinir Senha'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--fg-muted)', marginTop: '24px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-soft)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, padding: 0 }}
          >
            Voltar ao Login
          </button>
        </p>
      </div>
    </main>
  );
};
