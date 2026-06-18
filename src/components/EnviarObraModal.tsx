import React, { useState } from 'react';
import { Pedido, Categoria } from '../types';
import { ALL_CATEGORIAS } from '../lib/data';
import { enviarObra } from '../lib/pedidos';

interface EnviarObraModalProps {
  pedido: Pedido;
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const EnviarObraModal: React.FC<EnviarObraModalProps> = ({ pedido, userId, onClose, onSuccess }) => {
  const [categoria, setCategoria] = useState<Categoria>(pedido.categoria);
  const [titulo, setTitulo] = useState(pedido.titulo === 'Aguardando envio da obra' ? '' : pedido.titulo);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivo) {
      setError('Selecione o arquivo da sua obra.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const categoriaName = ALL_CATEGORIAS.find((c) => c.key === categoria)?.name ?? categoria;
      await enviarObra(userId, pedido.id, { categoria, categoriaName, titulo, arquivo });
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar a obra.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: '440px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)', padding: '32px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 4px', fontSize: '20px' }}>Enviar minha obra</h2>
        <p style={{ margin: '0 0 24px', color: 'var(--fg-muted)', fontSize: '13px' }}>
          Protocolo: {pedido.protocolo}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
              required
              style={{
                width: '100%', padding: '10px 14px', background: 'var(--bg-surface)',
                border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                color: 'var(--fg)', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }}
            >
              {ALL_CATEGORIAS.map((c) => (
                <option key={c.key} value={c.key}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Título da obra
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              placeholder="Ex: Minha música - Versão final"
              style={{
                width: '100%', padding: '10px 14px', background: 'var(--bg-surface)',
                border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                color: 'var(--fg)', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Arquivo da obra
            </label>
            <input
              type="file"
              onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
              required
              style={{
                width: '100%', padding: '8px', background: 'var(--bg-surface)',
                border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                color: 'var(--fg)', fontSize: '13px', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1, height: '44px' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1, height: '44px' }}
            >
              {loading ? 'Enviando…' : 'Enviar obra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
