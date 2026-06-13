// Supabase Edge Function — cria preferência de pagamento no Mercado Pago
// POST /functions/v1/criar-preferencia
// Body: { pacote_id: "1reg" | "2reg" | "3reg", email?: string }

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PACOTES: Record<string, { label: string; registros: number; preco: number }> = {
  '1reg': { label: '1 Registro — Totalis',    registros: 1, preco: 47.90 },
  '2reg': { label: '2 Registros — Totalis',   registros: 2, preco: 77.90 },
  '3reg': { label: '3 Registros — Totalis',   registros: 3, preco: 97.90 },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const { pacote_id, email } = await req.json();
    const pacote = PACOTES[pacote_id];
    if (!pacote) return json({ error: 'Pacote inválido' }, 400);

    const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN');
    if (!MP_ACCESS_TOKEN) return json({ error: 'MP_ACCESS_TOKEN não configurado' }, 500);

    const APP_URL = Deno.env.get('APP_URL') ?? 'https://senacomercial.github.io/novototaldocumentos03';
    const WEBHOOK_URL = Deno.env.get('SUPABASE_URL') + '/functions/v1/webhook-mp';

    const preference = {
      items: [{
        id: pacote_id,
        title: pacote.label,
        quantity: 1,
        unit_price: pacote.preco,
        currency_id: 'BRL',
      }],
      payer: email ? { email } : undefined,
      external_reference: pacote_id,
      notification_url: WEBHOOK_URL,
      back_urls: {
        success: `${APP_URL}/obrigado`,
        failure: `${APP_URL}/#pacotes`,
        pending: `${APP_URL}/obrigado`,
      },
      auto_return: 'approved',
      statement_descriptor: 'TOTALIS',
      metadata: { pacote_id, registros: pacote.registros },
    };

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    const mpData = await mpRes.json();
    if (!mpRes.ok) return json({ error: mpData.message ?? 'Erro no Mercado Pago' }, 502);

    return json({
      checkout_url: mpData.init_point,         // produção
      sandbox_url:  mpData.sandbox_init_point, // testes
      preference_id: mpData.id,
    });
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
