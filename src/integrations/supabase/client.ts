import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In test mode, we want to avoid throwing so that the test runner can initialize.
  // We also check for CI or DEV environments if we want to be more lenient,
  // but for a strict security fix, we should only be lenient in 'test' mode.
  if (import.meta.env.MODE === 'test') {
    console.warn('Supabase environment variables are missing. Using placeholder client for testing.');
  } else {
    throw new Error(
      'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
    );
  }
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'public-anon-key',
  {
    auth: {
      persistSession: true
    }
  }
);
