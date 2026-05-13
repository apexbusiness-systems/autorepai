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
    const url = new URL(req.url);
    const consentId = url.searchParams.get('token');
    const leadId = url.searchParams.get('lead');

    if (!consentId || !leadId) {
      return new Response(JSON.stringify({ error: 'Missing token or lead ID' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Update the consent status to withdrawn
    const { data: consent, error: updateError } = await supabase
      .from('consents')
      .update({
        status: 'withdrawn',
        withdrawn_at: new Date().toISOString()
      })
      .eq('id', consentId)
      .eq('lead_id', leadId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating consent:', updateError);
      throw new Error('Invalid unsubscribe link or failed to update consent');
    }

    // 2. Log the audit event
    await supabase.from('audit_events').insert({
      event_type: 'consent_withdrawal',
      action: 'unsubscribe_link',
      resource_type: 'consent',
      resource_id: consentId,
      metadata: {
        channel: consent?.channel || 'unknown',
        method: 'one_click_link'
      }
    });

    // 3. Update the lead's global opt-in status if necessary
    if (consent?.type === 'marketing') {
      await supabase
        .from('leads')
        .update({ consent_marketing: false })
        .eq('id', leadId);
    }

    // Return a success page
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribe Successful</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 40px 20px; background: #f9fafb; color: #111827; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          h1 { color: #10b981; }
          p { color: #4b5563; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Successfully Unsubscribed</h1>
          <p>You have been removed from our mailing list and will no longer receive marketing communications.</p>
          <p>This action has been logged in accordance with compliance regulations.</p>
        </div>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);

    // Return a generic error page
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribe Error</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 40px 20px; background: #f9fafb; color: #111827; }
          .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          h1 { color: #ef4444; }
          p { color: #4b5563; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Link Expired or Invalid</h1>
          <p>We couldn't process your request. The link may be expired or invalid.</p>
          <p>Please contact the dealership directly if you wish to be removed from their communications.</p>
        </div>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      status: 400
    });
  }
});
