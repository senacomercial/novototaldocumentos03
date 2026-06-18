import React, { useState, useEffect } from 'react';
import { resetPasswordForEmail, updatePassword } from '../lib/auth';
import { supabase } from '../lib/supabase';

interface ResetPasswordProps {
  navigate: (path: string, section?: string) => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ navigate }) => {
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'recovery') {
      setStep('confirm');
    }
  }, []);

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await resetPasswordForEmail(email);
      setMessage('✅ Email enviado! Verifique sua caixa de entrada para o link de recuperação.');
      setEmail('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar reset de senha.');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmReset(e: React.FormEvent) {
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
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setError('Sessão expirada. Solicite um novo link de recuperação.');
        return;
      }
      await updatePassword(password);
      setMessage('✅ Senha redefinida com sucesso! Redirecionando...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha.');
    } finally {
      setLoading(false);
    }
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
          {step === 'request' ? 'Recuperar Senha' : 'Definir Nova Senha'}
        </h1>
        <p style={{ color: 'var(--fg-muted)', fontSize: '14px', marginBottom: '32px' }}>
          {step === 'request'
            ? 'Digite seu e-mail para receber um link de recuperação'
            : 'Crie uma nova senha para sua conta'}
        </p>

        <form onSubmit={step === 'request' ? handleRequestReset : handleConfirmReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {step === 'request' ? (
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
          ) : (
            <>
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
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirme sua senha"
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
            </>
          )}

          {error && (
            <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>
          )}
          {message && (
            <p style={{ color: '#10b981', fontSize: '13px', margin: 0 }}>{message}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ height: '44px', marginTop: '8px' }}
          >
            {loading ? 'Processando…' : step === 'request' ? 'Enviar Link' : 'Redefinir Senha'}
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
