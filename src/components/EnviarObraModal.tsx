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

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: 'var(--bg-surface)',
  border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
  color: 'var(--fg)', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px',
};

export const EnviarObraModal: React.FC<EnviarObraModalProps> = ({ pedido, userId, onClose, onSuccess }) => {
  const [categoria, setCategoria] = useState<Categoria>(pedido.categoria);
  const [titulo, setTitulo] = useState(pedido.titulo === 'Aguardando envio da obra' ? '' : pedido.titulo);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [emailAutor, setEmailAutor] = useState('');
  const [telefone, setTelefone] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [descricao, setDescricao] = useState('');
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
      await enviarObra(userId, pedido.id, {
        categoria, categoriaName, titulo, arquivo,
        nomeCompleto, cpf, emailAutor, telefone,
        logradouro, numero, complemento, cidade, estado, cep, descricao,
      });
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
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '24px 16px', zIndex: 1000, overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', maxWidth: '520px', marginTop: 'auto', marginBottom: 'auto',
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

          {/* Categoria */}
          <div>
            <label style={labelStyle}>Categoria</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
              required
              style={inputStyle}
            >
              {ALL_CATEGORIAS.map((c) => (
                <option key={c.key} value={c.key}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div>
            <label style={labelStyle}>Título da obra</label>
            <input
              type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
              required placeholder="Ex: Minha música - Versão final"
              style={inputStyle}
            />
          </div>

          {/* Descrição */}
          <div>
            <label style={labelStyle}>Breve descrição da obra</label>
            <textarea
              value={descricao} onChange={(e) => setDescricao(e.target.value)}
              required placeholder="Descreva brevemente sua obra (tema, conteúdo, estilo…)"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Dados do autor
            </p>

            {/* Nome Completo */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Nome Completo</label>
              <input type="text" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)}
                required placeholder="Nome completo do autor" style={inputStyle} />
            </div>

            {/* CPF */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>CPF</label>
              <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)}
                required placeholder="000.000.000-00" style={inputStyle} />
            </div>

            {/* Email e Telefone lado a lado */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>E-mail</label>
                <input type="email" value={emailAutor} onChange={(e) => setEmailAutor(e.target.value)}
                  required placeholder="seu@email.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Telefone com DDD</label>
                <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)}
                  required placeholder="(11) 99999-9999" style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Endereço
            </p>

            {/* Logradouro + Número */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>Logradouro</label>
                <input type="text" value={logradouro} onChange={(e) => setLogradouro(e.target.value)}
                  required placeholder="Rua, Avenida…" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Número</label>
                <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)}
                  required placeholder="123" style={inputStyle} />
              </div>
            </div>

            {/* Complemento */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Complemento <span style={{ fontWeight: 400, color: 'var(--fg-muted)' }}>(opcional)</span></label>
              <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)}
                placeholder="Apto, Bloco, Sala…" style={inputStyle} />
            </div>

            {/* Cidade + Estado + CEP */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 130px', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Cidade</label>
                <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)}
                  required placeholder="São Paulo" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Estado</label>
                <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)}
                  required placeholder="SP" maxLength={2} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>CEP</label>
                <input type="text" value={cep} onChange={(e) => setCep(e.target.value)}
                  required placeholder="00000-000" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Arquivo */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <label style={labelStyle}>Arquivo da obra</label>
            <input
              type="file"
              onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
              required
              style={{ ...inputStyle, padding: '8px' }}
            />
          </div>

          {error && (
            <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, height: '44px', background: 'transparent', border: '1px solid var(--border-strong)', borderRadius: 'var(--r-sm)', color: 'var(--fg)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ flex: 1, height: '44px' }}>
              {loading ? 'Enviando…' : 'Enviar obra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
