// Supabase Edge Function — entrega documentos de registro ao cliente
// POST /functions/v1/entregar-registro
// Body: { pedido_id: string, caminhos: string[] }  (até 3 paths no Storage)

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
    const { pedido_id, caminhos } = await req.json() as { pedido_id: string; caminhos: string[] };
    if (!pedido_id || !Array.isArray(caminhos) || caminhos.length === 0) {
      return json({ error: 'pedido_id e caminhos são obrigatórios' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // 1. Busca dados do pedido + email do cliente
    const { data: pedido, error: pedidoErr } = await supabase
      .from('pedidos')
      .select('id, protocolo, titulo, categoria_name, user_id, users:user_id(email)')
      .eq('id', pedido_id)
      .single();

    if (pedidoErr || !pedido) return json({ error: 'Pedido não encontrado' }, 404);

    const emailCliente = (pedido as { users: { email: string } | null }).users?.email ?? '';

    // 2. Gera URLs assinadas (7 dias) para cada arquivo
    const SETE_DIAS = 7 * 24 * 60 * 60;
    const linksArquivos: { nome: string; url: string }[] = [];

    for (const caminho of caminhos.slice(0, 3)) {
      const { data: signed, error: signErr } = await supabase.storage
        .from('obras')
        .createSignedUrl(caminho, SETE_DIAS);

      if (signErr || !signed) continue;

      const nome = caminho.split('/').pop() ?? caminho;
      linksArquivos.push({ nome, url: signed.signedUrl });

      // Registra na tabela certificados
      await supabase.from('certificados').insert({
        pedido_id,
        storage_path: caminho,
        nome_arquivo: nome,
        enviado_por_email: true,
      });
    }

    // 3. Atualiza status do pedido para CONCLUIDO
    await supabase
      .from('pedidos')
      .update({ status: 'CONCLUIDO', progress: 100, certificado: true })
      .eq('id', pedido_id);

    // 4. Envia email ao cliente via Resend
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    let emailEnviado = false;

    if (RESEND_API_KEY && emailCliente) {
      const APP_URL = Deno.env.get('APP_URL') ?? 'https://app.registrototalis.com.br';
      const htmlEmail = buildEmailEntrega({
        email: emailCliente,
        protocolo: pedido.protocolo,
        titulo: pedido.titulo,
        categoria: pedido.categoria_name,
        links: linksArquivos,
        APP_URL,
      });

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Totalis <naoresponda@app.registrototalis.com.br>',
          to: [emailCliente],
          subject: `🎉 Seu registro está pronto! — Protocolo ${pedido.protocolo}`,
          html: htmlEmail,
        }),
      });

      emailEnviado = emailRes.ok;
      await supabase.from('emails_log').insert({
        pedido_id,
        tipo: 'CONCLUSAO',
        sucesso: emailEnviado,
        erro: emailEnviado ? null : await emailRes.text(),
      });
    }

    return json({ ok: true, arquivosEntregues: linksArquivos.length, emailEnviado });
  } catch (err) {
    console.error('entregar-registro error:', err);
    return json({ error: String(err) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function buildEmailEntrega(p: {
  email: string;
  protocolo: string;
  titulo: string;
  categoria: string;
  links: { nome: string; url: string }[];
  APP_URL: string;
}) {
  const linksHtml = p.links.map((l, i) =>
    `<tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(168,85,247,0.15);">
        <span style="color:#b8b3c7;font-size:13px;">Documento ${i + 1}</span><br>
        <a href="${l.url}" style="color:#c084fc;font-size:14px;font-weight:600;text-decoration:none;">
          📄 ${l.nome}
        </a>
      </td>
    </tr>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Registro concluído — Totalis</title></head>
<body style="margin:0;padding:0;background:#07060b;font-family:Inter,system-ui,sans-serif;color:#f5f3ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <tr><td>
      <div style="font-size:26px;font-weight:800;letter-spacing:-0.5px;margin-bottom:32px;">
        <span style="color:#c084fc;">T</span>OTALIS
      </div>

      <div style="background:#14111f;border:1px solid rgba(168,85,247,0.32);border-radius:16px;padding:32px;margin-bottom:24px;">
        <div style="font-size:13px;color:#c084fc;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">Registro concluído 🎉</div>
        <h2 style="margin:0 0 16px;font-size:22px;font-weight:700;">Seus documentos estão prontos!</h2>
        <p style="margin:0;color:#b8b3c7;font-size:14px;line-height:1.6;">
          Olá! Seu registro foi processado com sucesso. Abaixo estão os links para download dos seus documentos.
          Os links são válidos por <strong style="color:#f5f3ff;">7 dias</strong>.
        </p>
      </div>

      <div style="background:#14111f;border:1px solid rgba(168,85,247,0.2);border-radius:12px;padding:24px;margin-bottom:24px;">
        <div style="font-size:12px;color:#b8b3c7;margin-bottom:4px;">PROTOCOLO</div>
        <div style="font-family:monospace;font-size:18px;font-weight:700;color:#c084fc;margin-bottom:16px;">${p.protocolo}</div>
        <div style="font-size:12px;color:#b8b3c7;margin-bottom:4px;">OBRA</div>
        <div style="font-size:14px;margin-bottom:4px;">${p.titulo}</div>
        <div style="font-size:12px;color:#b8b3c7;">${p.categoria}</div>
      </div>

      <div style="background:#14111f;border:1px solid rgba(168,85,247,0.2);border-radius:12px;padding:24px;margin-bottom:24px;">
        <div style="font-size:13px;font-weight:700;margin-bottom:16px;">📥 Documentos para download</div>
        <table style="width:100%;border-collapse:collapse;">
          ${linksHtml}
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#b8b3c7;">
          ⚠️ Links válidos por 7 dias. Faça o download e guarde os documentos em local seguro.
        </p>
      </div>

      <div style="text-align:center;margin-bottom:32px;">
        <a href="${p.APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(180deg,#c084fc,#7c3aed);color:#fff;font-weight:700;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;">
          Acessar minha área →
        </a>
      </div>

      <div style="border-top:1px solid rgba(168,85,247,0.15);padding-top:24px;text-align:center;color:#6b6780;font-size:12px;">
        <p style="margin:0 0 4px;">Totalis — Registro de Direitos Autorais</p>
        <p style="margin:0;">© 2025 Total Documentos. Todos os direitos reservados.</p>
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}
