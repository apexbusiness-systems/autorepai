import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only throw error if we're not in a test environment and variables are missing
if (import.meta.env.MODE !== 'test' && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  );
}

// In test environment, use placeholders if variables are missing
// This prevents initialization errors when the client is mocked anyway
const finalUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalAnonKey = supabaseAnonKey || 'public-anon-key';

export const supabase = createClient(finalUrl, finalAnonKey, {
  auth: {
    persistSession: true
  }
});
