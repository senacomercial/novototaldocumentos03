// Supabase Edge Function — webhook Mercado Pago
// POST /functions/v1/webhook-mp
// Chamado pelo MP após pagamento. Cria usuário, compra, pedidos e envia email.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PACOTES: Record<string, { registros: number; preco: number }> = {
  '1reg': { registros: 1, preco: 47.90 },
  '2reg': { registros: 2, preco: 77.90 },
  '3reg': { registros: 3, preco: 97.90 },
};

const CATEGORIA_NAMES: Record<string, string> = {
  MUSICAS: 'Músicas', LETRAS: 'Letras', CLIPES: 'Clipes', TEXTOS: 'Textos',
  LIVROS: 'Livros', EBOOKS: 'E-books', CONTRATOS: 'Contratos', TESES: 'Teses',
  CURSOS: 'Cursos', FOTOGRAFIAS: 'Fotografias', ARTES: 'Artes', ANUNCIOS: 'Anúncios',
  VIDEOS: 'Vídeos', PLANTAS: 'Plantas', PROJETOS: 'Projetos', PERSONAGENS: 'Personagens',
};

serve(async (req) => {
  try {
    const body = await req.json();

    // MP envia notificações de vários tipos; só processamos pagamentos aprovados
    if (body.type !== 'payment' && body.action !== 'payment.updated') {
      return new Response('ok', { status: 200 });
    }

    const paymentId = body.data?.id;
    if (!paymentId) return new Response('sem payment id', { status: 400 });

    // ── 1. Busca detalhes do pagamento no MP ──────────────────────────────────
    const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!;
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    });
    const payment = await mpRes.json();

    if (payment.status !== 'approved') {
      return new Response('pagamento não aprovado', { status: 200 });
    }

    // external_reference pode ser JSON { pacote_id, email } ou string legada
    let pacote_id = '1reg';
    let email = payment.payer?.email as string;
    try {
      const ref = JSON.parse(payment.external_reference ?? '{}');
      if (ref.pacote_id) pacote_id = ref.pacote_id;
      if (ref.email) email = ref.email;
    } catch {
      pacote_id = payment.external_reference ?? '1reg';
    }
    const mp_payment_id = String(payment.id);
    const valor         = payment.transaction_amount as number;
    const pacote        = PACOTES[pacote_id] ?? PACOTES['1reg'];

    // ── 2. Supabase admin client (service role — ignora RLS) ─────────────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // ── 3. Cria ou recupera usuário ───────────────────────────────────────────
    let userId: string;
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === email);

    if (existing) {
      userId = existing.id;
    } else {
      const tempPassword = crypto.randomUUID();
      const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
      });
      if (createErr) throw new Error(`Erro ao criar usuário: ${createErr.message}`);
      userId = newUser.user.id;

      // Cria perfil
      await supabase.from('profiles').insert({ id: userId, nome_completo: email.split('@')[0] });
    }

    // ── 4. Cria compra ────────────────────────────────────────────────────────
    const { data: compra, error: compraErr } = await supabase
      .from('compras')
      .insert({
        user_id: userId,
        pacote_id,
        registros: pacote.registros,
        valor,
        creditos_restantes: pacote.registros,
        payment_id: mp_payment_id,
        status: 'approved',
      })
      .select()
      .single();

    if (compraErr) throw new Error(`Erro ao criar compra: ${compraErr.message}`);

    // ── 5. Cria pedidos (um por crédito do pacote) ────────────────────────────
    const pedidosInsert = Array.from({ length: pacote.registros }, () => ({
      user_id:        userId,
      compra_id:      compra.id,
      categoria:      'MUSICAS' as const,
      categoria_name: 'Músicas',
      titulo:         'Aguardando envio da obra',
      valor:          valor / pacote.registros,
      status:         'RECEBIDO' as const,
      progress:       0,
    }));

    const { data: pedidos, error: pedidosErr } = await supabase
      .from('pedidos')
      .insert(pedidosInsert)
      .select();

    if (pedidosErr) throw new Error(`Erro ao criar pedidos: ${pedidosErr.message}`);

    const protocolo = pedidos![0].protocolo;

    // ── 6. Gera link para definir senha ───────────────────────────────────────
    const APP_URL = Deno.env.get('APP_URL') ?? 'https://senacomercial.github.io/novototaldocumentos03';
    const { data: linkData } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `${APP_URL}/dashboard` },
    });
    const accessLink = linkData?.properties?.action_link ?? `${APP_URL}/login`;

    // ── 7. Envia email via Resend ─────────────────────────────────────────────
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (RESEND_API_KEY) {
      const emailHtml = buildEmailBoasVindas({ email, protocolo, pacote_id, registros: pacote.registros, accessLink, APP_URL });
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Totalis <naoresponda@app.registrototalis.com.br>',
          to: [email],
          subject: `✅ Pedido recebido — Protocolo ${protocolo}`,
          html: emailHtml,
        }),
      });

      const sucesso = emailRes.ok;
      await supabase.from('emails_log').insert({
        pedido_id: pedidos![0].id,
        tipo:      'BOAS_VINDAS',
        sucesso,
        erro:      sucesso ? null : await emailRes.text(),
      });

      // Notificação de nova compra para o admin
      const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL');
      if (ADMIN_EMAIL) {
        const label = pacote.registros === 1 ? '1 registro' : `${pacote.registros} registros`;
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Totalis <naoresponda@app.registrototalis.com.br>',
            to: [ADMIN_EMAIL],
            subject: `💰 Nova compra — ${label} — ${email}`,
            html: `<!DOCTYPE html><html lang="pt-BR"><body style="margin:0;padding:0;background:#07060b;font-family:Inter,system-ui,sans-serif;color:#f5f3ff;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;padding:32px 24px;">
  <tr><td>
    <div style="font-size:22px;font-weight:800;color:#c084fc;margin-bottom:24px;">Totalis</div>
    <div style="background:#14111f;border:1px solid rgba(168,85,247,0.32);border-radius:12px;padding:28px;">
      <div style="font-size:13px;color:#c084fc;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">Nova compra recebida 💰</div>
      <table style="width:100%;font-size:14px;border-collapse:collapse;">
        <tr><td style="color:#b8b3c7;padding:6px 0;width:140px;">Protocolo</td><td style="font-family:monospace;color:#c084fc;font-weight:700;">${protocolo}</td></tr>
        <tr><td style="color:#b8b3c7;padding:6px 0;">Pacote</td><td>${label}</td></tr>
        <tr><td style="color:#b8b3c7;padding:6px 0;">Valor</td><td style="font-weight:700;">R$ ${valor.toFixed(2).replace('.', ',')}</td></tr>
        <tr><td style="color:#b8b3c7;padding:6px 0;">Cliente</td><td>${email}</td></tr>
        <tr><td style="color:#b8b3c7;padding:6px 0;">Payment ID</td><td style="font-family:monospace;font-size:12px;">${mp_payment_id}</td></tr>
      </table>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <a href="${APP_URL}/admin" style="display:inline-block;background:linear-gradient(180deg,#c084fc,#7c3aed);color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">
        Ver no painel →
      </a>
    </div>
  </td></tr>
</table>
</body></html>`,
          }),
        }).catch(() => { /* best-effort */ });
      }
    }

    return new Response(JSON.stringify({ ok: true, protocolo, userId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('webhook-mp error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

// ─── Template de email ────────────────────────────────────────────────────────
function buildEmailBoasVindas(p: {
  email: string; protocolo: string; pacote_id: string;
  registros: number; accessLink: string; APP_URL: string;
}) {
  const label = p.registros === 1 ? '1 registro' : `${p.registros} registros`;
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pedido recebido — Totalis</title></head>
<body style="margin:0;padding:0;background:#07060b;font-family:Inter,system-ui,sans-serif;color:#f5f3ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <tr><td>
      <!-- Logo -->
      <div style="margin-bottom:32px;">
        <span style="font-size:22px;font-weight:800;color:#c084fc;letter-spacing:-0.02em;">Totalis</span>
      </div>

      <!-- Hero -->
      <div style="background:#14111f;border:1px solid rgba(168,85,247,0.32);border-radius:12px;padding:36px;margin-bottom:24px;">
        <div style="font-size:13px;color:#c084fc;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;">Pedido confirmado</div>
        <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;line-height:1.15;">
          Protocolo <span style="color:#c084fc;">${p.protocolo}</span>
        </h1>
        <p style="margin:0;color:#b8b3c7;font-size:15px;line-height:1.5;">
          Seu pagamento foi aprovado e recebemos seu pedido de ${label}.<br>
          O prazo padrão é de <strong style="color:#f5f3ff;">24 horas</strong> a partir do envio da obra.
        </p>
      </div>

      <!-- Próximos passos -->
      <div style="margin-bottom:24px;">
        <h2 style="font-size:16px;font-weight:700;margin:0 0 16px;color:#f5f3ff;">Próximos passos</h2>
        ${[
          ['1', 'Acesse sua área', 'Clique no botão abaixo para entrar. Não precisa criar senha — o link já te autentica.'],
          ['2', 'Envie sua obra', 'No dashboard, abra seu pedido e faça o upload do arquivo que deseja registrar.'],
          ['3', 'Acompanhe o progresso', 'Você receberá atualizações por email a cada etapa do processo.'],
        ].map(([n, title, desc]) => `
        <div style="display:flex;gap:14px;margin-bottom:16px;">
          <div style="width:28px;height:28px;border-radius:50%;background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.32);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;font-size:13px;color:#c084fc;text-align:center;line-height:28px;">${n}</div>
          <div>
            <div style="font-weight:600;font-size:14px;color:#f5f3ff;margin-bottom:4px;">${title}</div>
            <div style="font-size:13px;color:#b8b3c7;line-height:1.5;">${desc}</div>
          </div>
        </div>`).join('')}
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${p.accessLink}" style="display:inline-block;background:linear-gradient(180deg,#c084fc,#7c3aed);color:#fff;font-weight:700;font-size:15px;padding:16px 36px;border-radius:8px;text-decoration:none;letter-spacing:-0.01em;">
          Acessar minha área →
        </a>
      </div>

      <!-- Info protocolo -->
      <div style="background:#0f0c18;border-radius:8px;padding:18px;margin-bottom:24px;font-size:13px;">
        <div style="color:#6f6981;margin-bottom:6px;">Guarde este protocolo para consultas:</div>
        <div style="font-family:monospace;font-size:16px;font-weight:700;color:#c084fc;letter-spacing:0.04em;">${p.protocolo}</div>
        <div style="color:#6f6981;margin-top:8px;">
          Consulta pública disponível em <a href="${p.APP_URL}/consultar" style="color:#c084fc;">${p.APP_URL}/consultar</a>
        </div>
      </div>

      <!-- Footer -->
      <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:24px;font-size:12px;color:#6f6981;text-align:center;">
        <p style="margin:0 0 8px;">© 2026 Totalis · Total Documentos</p>
        <p style="margin:0;">Dúvidas? Responda este email ou acesse nossa <a href="${p.APP_URL}" style="color:#c084fc;">central de ajuda</a>.</p>
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}
