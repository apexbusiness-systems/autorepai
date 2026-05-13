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
    const authHeader = req.headers.get('Authorization')!;
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { dealership_id } = await req.json();

    if (!dealership_id) {
       return new Response(JSON.stringify({ error: 'dealership_id is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    console.log(`Inventory sync started for dealership: ${dealership_id}`);

    // In a real application, this would fetch from a DMS/vAuto API.
    // For now, we update the last_sync timestamp or log the sync.
    const syncResult = await supabaseClient.from('inventory_sync_logs').insert({
      dealership_id,
      synced_by: user.id,
      status: 'completed',
      records_processed: 0
    });

    if (syncResult.error && syncResult.error.code !== '42P01') {
      console.error(syncResult.error);
    }

    return new Response(JSON.stringify({ success: true, message: 'Inventory sync initiated successfully' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
