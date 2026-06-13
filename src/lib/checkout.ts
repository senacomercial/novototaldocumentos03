const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

export interface CheckoutResult {
  checkout_url: string;
  sandbox_url: string;
  preference_id: string;
}

export async function criarCheckout(pacote_id: string, email?: string): Promise<CheckoutResult> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/criar-preferencia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pacote_id, email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? 'Erro ao iniciar checkout');
  }

  return res.json();
}
