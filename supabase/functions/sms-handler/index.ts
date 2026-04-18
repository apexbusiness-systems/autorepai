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
    const formData = await req.formData();
    const body = formData.get('Body')?.toString() || '';
    const from = formData.get('From')?.toString() || '';

    if (!body || !from) {
      throw new Error('Missing Body or From');
    }

    if (body.trim().toUpperCase() === 'STOP') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // 1. Find lead by phone number
      const { data: leads } = await supabase
        .from('leads')
        .select('id')
        .eq('phone', from)
        .limit(1);

      if (leads && leads.length > 0) {
        const leadId = leads[0].id;

        // 2-5. Execute independent updates concurrently
        const [_, dncResult] = await Promise.all([
          // 2. Update consent status to withdrawn for SMS channel
          supabase
            .from('consents')
            .update({
              status: 'withdrawn',
              withdrawn_at: new Date().toISOString()
            })
            .eq('lead_id', leadId)
            .eq('channel', 'sms'),

          // 3. Add to internal DNC list table
          supabase.from('dnc_list').upsert({
            phone_number: from,
            source: 'sms_stop_keyword',
            added_at: new Date().toISOString()
          }),

          // 4. Log audit event
          supabase.from('audit_events').insert({
            event_type: 'consent_withdrawal',
            action: 'sms_stop',
            resource_type: 'consent',
            metadata: { channel: 'sms', keyword: 'STOP', phone: from }
          }),

          // 5. Update the lead's global opt-in status if necessary
          supabase
            .from('leads')
            .update({ consent_marketing: false })
            .eq('id', leadId)
        ]);

        const dncError = dncResult.error;
        if (dncError && dncError.code !== '42P01') {
            // Ignore 42P01 if the table doesn't exist yet, but log others
            console.error('DNC List Insert Error:', dncError);
        }
      }

      // Twilio requires an empty TwiML response or a valid TwiML response
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>You have been unsubscribed. You will not receive further marketing messages.</Message>
</Response>`;
      return new Response(twiml, {
        headers: { ...corsHeaders, 'Content-Type': 'text/xml' }
      });
    }

    return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      headers: { ...corsHeaders, 'Content-Type': 'text/xml' }
    });
  } catch (error) {
    console.error('SMS handler error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
