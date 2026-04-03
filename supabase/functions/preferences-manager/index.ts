import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    let leadId = url.searchParams.get('lead');
    let preferences = null;

    if (req.method === 'POST') {
      const body = await req.json();
      leadId = leadId || body.leadId;
      preferences = body.preferences;
    }

    if (!leadId) {
      return new Response(JSON.stringify({ error: 'Missing lead ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'GET') {
      const { data: consents, error: fetchError } = await supabase
        .from('consents')
        .select('*')
        .eq('lead_id', leadId)
        .eq('status', 'granted');

      if (fetchError) throw fetchError;

      const prefs = {
        marketing: false,
        email: false,
        sms: false,
        phone: false
      };

      consents?.forEach(consent => {
        if (consent.type === 'marketing') prefs.marketing = true;
        if (consent.channel === 'email') prefs.email = true;
        if (consent.channel === 'sms') prefs.sms = true;
        if (consent.channel === 'phone') prefs.phone = true;
      });

      return new Response(JSON.stringify({ preferences: prefs }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'POST') {
      await supabase.from('leads').update({
        consent_marketing: preferences.marketing
      }).eq('id', leadId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Preferences manager error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
