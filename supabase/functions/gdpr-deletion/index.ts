import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' } });
  }

  const { lead_id, email } = await req.json();

  if (!lead_id && !email) {
    return new Response(JSON.stringify({ error: 'lead_id or email required' }), { status: 400 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  let query = supabaseAdmin.from('leads').delete();
  if (lead_id) query = query.eq('id', lead_id);
  else if (email) query = query.eq('email', email);

  const { error } = await query;

  // Also delete from credit_applications
  if (lead_id) {
    await supabaseAdmin.from('credit_applications').delete().eq('lead_id', lead_id);
  }

  if (error) {
    console.error('GDPR deletion error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
});
