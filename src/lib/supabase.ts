import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Captura URL antes do Supabase processar e limpar os parâmetros
export const capturedUrl = typeof window !== 'undefined' ? {
  hash: window.location.hash,
  search: window.location.search,
} : { hash: '', search: '' };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'implicit',
  },
});
