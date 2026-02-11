import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    throw new Error(
      'Supabase environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing.'
    );
  } else {
    // Fail fast in production
    throw new Error('Critical configuration error: Supabase not initialized.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true
  }
});
