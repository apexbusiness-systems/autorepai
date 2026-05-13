import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Ensure authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const payload = await req.json();

    if (!payload.application_id) {
       return new Response(JSON.stringify({ error: 'application_id is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    console.log(`Credit webhook processing for application: ${payload.application_id}`);

    // Validate consent log
    const { data: consentLog, error: consentError } = await supabaseClient
      .from('consent_logs')
      .select('*')
      .eq('lead_id', payload.lead_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (consentError || !consentLog || !consentLog.consent_granted) {
      return new Response(JSON.stringify({ error: 'Missing explicit consent for credit application' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { error: updateError } = await supabaseClient
      .from('credit_applications')
      .update({ status: payload.status || 'review', updated_at: new Date().toISOString() })
      .eq('id', payload.application_id);

    if (updateError) {
      console.error(updateError);
      throw new Error('Failed to update credit application');
    }

    return new Response(JSON.stringify({ success: true, message: 'Credit application webhook processed securely' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
