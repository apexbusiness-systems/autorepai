import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.MODE !== 'test') {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
    );
  }
  // In test mode, we use placeholders to avoid crashing the test environment
  // but we still want to log a warning if they are missing
  console.warn('Supabase environment variables are missing in test mode. Using placeholder client.');
}

const finalSupabaseUrl = supabaseUrl ?? 'https://placeholder.supabase.co';
const finalSupabaseAnonKey = supabaseAnonKey ?? 'public-anon-key';

export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    persistSession: true
  }
});
