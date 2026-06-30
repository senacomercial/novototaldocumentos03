// Supabase Edge Function — notifica o admin quando um cliente envia a obra
// POST /functions/v1/notificar-envio-obra
// Body: { pedido_id: string }
// Requer JWT do próprio cliente (verify_jwt: true) — só notifica pedidos que o
// chamador realmente é dono de (RLS do client com o token do usuário garante isso).

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const { pedido_id } = await req.json();
    if (!pedido_id) return json({ error: 'pedido_id é obrigatório' }, 400);

    const authHeader = req.headers.get('Authorization') ?? '';
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return json({ error: 'Não autenticado' }, 401);

    // RLS garante que só retorna o pedido se for do próprio usuário
    const { data: pedido, error: pedidoErr } = await supabase
      .from('pedidos')
      .select('id, protocolo, categoria_name, titulo, status')
      .eq('id', pedido_id)
      .single();

    if (pedidoErr || !pedido) return json({ error: 'Pedido não encontrado' }, 404);

    const APP_URL = Deno.env.get('APP_URL') ?? 'https://app.registrototalis.com.br';
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    // ADMIN_EMAIL pode conter vários endereços separados por vírgula.
    const adminEmails = (ADMIN_EMAIL ?? '')
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    let sucesso = false;
    let erroMsg: string | null = null;

    if (RESEND_API_KEY && adminEmails.length > 0) {
      const html = `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
          <div style="background:#07060b;padding:16px;border-radius:10px;margin-bottom:16px;text-align:center;"><img src="${APP_URL}/logo-totalis-sem-fundo.png" alt="Totalis" width="140" style="display:inline-block;max-width:140px;height:auto;" /></div>
          <h2>📤 Nova obra enviada para registro</h2>
          <p><strong>Protocolo:</strong> ${pedido.protocolo}</p>
          <p><strong>Categoria:</strong> ${pedido.categoria_name}</p>
          <p><strong>Título:</strong> ${pedido.titulo}</p>
          <p><strong>Cliente:</strong> ${user.email}</p>
          <p><a href="${APP_URL}/admin">Abrir painel administrativo →</a></p>
        </div>
      `;
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Totalis <naoresponda@app.registrototalis.com.br>',
          to: adminEmails,
          subject: `📤 Nova obra recebida — Protocolo ${pedido.protocolo}`,
          html,
        }),
      });
      sucesso = emailRes.ok;
      if (!sucesso) erroMsg = await emailRes.text();
    } else {
      erroMsg = 'RESEND_API_KEY ou ADMIN_EMAIL não configurados';
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    await supabaseAdmin.from('emails_log').insert({
      pedido_id: pedido.id,
      tipo: 'NOVA_OBRA_ADMIN',
      sucesso,
      erro: erroMsg,
    });

    return json({ ok: true });
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
