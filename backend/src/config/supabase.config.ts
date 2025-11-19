import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase configurado com service role key
 * ATENÇÃO: Service role key bypassa RLS, use com cuidado
 */
let supabase: SupabaseClient;

export const initSupabase = (): SupabaseClient => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'SUPABASE_URL e SUPABASE_SERVICE_KEY devem estar configurados no .env'
    );
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabase;
};

export const getSupabase = (): SupabaseClient => {
  if (!supabase) {
    return initSupabase();
  }
  return supabase;
};
